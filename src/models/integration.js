import mongoose from "mongoose";
import { encrypt, decrypt } from "../utils/crypto.js";

const integrationSchema = new mongoose.Schema({
	provider: {
		type: String,
		enum: ["mailchimp", "getresponse"],
		required: true,
	},
	apiKey: {
		type: String,
		required: true,
	},
	//owner can be ref to User model in future
	owner: { type: String },
	meta: { type: Object, default: {} },
	validated: { type: Boolean, default: false },
	lastValidatedAt: { type: Date },
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Encrypt apiKey before saving
integrationSchema.pre("save", function (next) {
	if (this.isModified("apiKey")) {
		this.apiKey = encrypt(this.apiKey);
	}
	next();
});

// Decrypt apiKey after retrieving
integrationSchema.methods.getDecryptedApiKey = function () {
	return decrypt(this.apiKey);
};

integrationSchema.index({ provider: 1, owner: 1 });

const Integration = mongoose.model("integration", integrationSchema);
export default Integration;
