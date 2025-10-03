import Integration from "../models/integration.js";
import { verifyMailchimp, getMailchimpLists } from "../services/mailchimp.js";
import { verifyGetResponse, getGRLists } from "../services/getresponse.js";
import { encrypt } from "../utils/crypto.js";

export async function saveAndValidateIntegration(req, res, next) {
	try {
		// auth middleware can set user ID in req.body.owner
		const { provider, apiKey, owner } = req.body;
		if (!provider || !apiKey) {
			return res.status(400).json({ success: false, message: "provider and apiKey are required" });
		}

		if (!["mailchimp", "getresponse"].includes(provider)) {
			return res.status(400).json({ success: false, message: "provider must be mailchimp or getresponse" });
		}

		// validate
		let validation;
		try {
			validation = provider === "mailchimp" ? await verifyMailchimp(apiKey) : await verifyGetResponse(apiKey);
		} catch (verErr) {
			if (verErr.type === "invalid") return res.status(401).json({ success: false, message: verErr.message });
			if (verErr.type === "rate_limit") return res.status(429).json({ success: false, message: verErr.message });
			return res.status(502).json({ success: false, message: verErr.message });
		}

		const meta = provider === "mailchimp" && validation.dc ? { dc: validation.dc } : {};

		const encryptedKey = encrypt(apiKey);

		const integration = await Integration.findOneAndUpdate(
			{ provider, owner: owner || null },
			{
				provider,
				apiKey: encryptedKey,
				meta,
				validated: true,
				lastValidatedAt: new Date(),
				owner,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		res.status(201).json({ success: true, integration });
	} catch (err) {
		next(err);
	}
}

export async function getLists(req, res, next) {
	try {
		const { id } = req.query;
		if (!id) return res.status(400).json({ success: false, message: "integration id is required" });

		const integration = await Integration.findById(id);
		if (!integration) return res.status(404).json({ success: false, message: "Integration not found" });

		const apiKey = integration.getDecryptedApiKey();
		try {
			if (integration.provider === "mailchimp") {
				const lists = await getMailchimpLists(apiKey, integration.meta.dc);
				return res.json({ success: true, provider: "mailchimp", lists });
			} else {
				const lists = await getGRLists(apiKey);
				return res.json({ success: true, provider: "getresponse", lists });
			}
		} catch (provErr) {
			if (provErr.type === "invalid") return res.status(401).json({ success: false, message: provErr.message });
			if (provErr.type === "rate_limit") return res.status(429).json({ success: false, message: provErr.message });
			return res.status(502).json({ success: false, message: provErr.message });
		}
	} catch (err) {
		next(err);
	}
}
