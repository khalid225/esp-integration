import axios from "axios";

const BASE = "https://api.getresponse.com/v3";

function buildAxiosConfig(apiKey) {
	return {
		headers: {
			"X-Auth-Token": `api-key ${apiKey}`,
			"Content-Type": "application/json",
		},
		timeout: 10000,
	};
}

export async function verifyGetResponse(apiKey) {
	try {
		await axios.get(`${BASE}/accounts`, buildAxiosConfig(apiKey));
		return { ok: true };
	} catch (err) {
		if (err.response) {
			if ([401, 403].includes(err.response.status)) throw { type: "invalid", message: "Invalid GetResponse API key" };
			if (err.response.status === 429) throw { type: "rate_limit", message: "GetResponse rate limit" };
			throw { type: "provider_error", message: `GetResponse responded with ${err.response.status}` };
		}
		throw { type: "network", message: err.message };
	}
}

export async function getGRLists(apiKey) {
	try {
		const campaignsRes = await axios.get(`${BASE}/campaigns`, buildAxiosConfig(apiKey));
		const campaigns = (campaignsRes.data || []).map((c) => ({
			id: c.campaignId || c.name,
			name: c.name,
		}));
		return { campaigns };
	} catch (err) {
		if (err.response) {
			if ([401, 403].includes(err.response.status)) throw { type: "invalid", message: "Invalid GetResponse API key" };
			if (err.response.status === 429) throw { type: "rate_limit", message: "GetResponse rate limit" };
			throw { type: "provider_error", message: `GetResponse responded with ${err.response.status}` };
		}
		throw { type: "network", message: err.message };
	}
}
