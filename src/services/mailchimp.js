import axios from "axios";

export function extractDcFromKey(apiKey) {
	if (!apiKey) return null;
	const parts = apiKey.split("-");
	return parts.length > 1 ? parts[parts.length - 1] : null;
}

export async function verifyMailchimp(apiKey) {
	const dc = extractDcFromKey(apiKey);
	if (!dc) throw { type: "invalid", message: "Invalid Mailchimp API key (missing data center suffix)" };

	const base = `https://${dc}.api.mailchimp.com/3.0`;
	try {
		await axios.get(`${base}/`, {
			auth: { username: "anystring", password: apiKey },
			timeout: 10000,
		});
		return { ok: true, dc };
	} catch (err) {
		if (err.response) {
			if (err.response.status === 401) throw { type: "invalid", message: "Invalid Mailchimp API key" };
			if (err.response.status === 429) throw { type: "rate_limit", message: "Mailchimp rate limit" };
			throw { type: "provider_error", message: `Mailchimp responded with ${err.response.status}` };
		}
		throw { type: "network", message: err.message };
	}
}

export async function getMailchimpLists(apiKey) {
	const dc = extractDcFromKey(apiKey);
	if (!dc) throw { type: "invalid", message: "Invalid Mailchimp API key" };

	const base = `https://${dc}.api.mailchimp.com/3.0`;
	try {
		const res = await axios.get(`${base}/lists`, {
			auth: { username: "khalid", password: apiKey },
			timeout: 10000,
		});
		return (res.data.lists || []).map((l) => ({
			id: l.id,
			name: l.name,
			member_count: l.stats?.member_count,
		}));
	} catch (err) {
		if (err.response) {
			if (err.response.status === 401) throw { type: "invalid", message: "Invalid Mailchimp API key" };
			if (err.response.status === 429) throw { type: "rate_limit", message: "Mailchimp rate limit" };
			throw { type: "provider_error", message: `Mailchimp responded with ${err.response.status}` };
		}
		throw { type: "network", message: err.message };
	}
}
