import express from "express";
import URL from "../models/urlModel.js";
const router = express.Router();

const generateShortCode = async () => {
    return Math.random().toString(36).slice(2, 8);
}

router.post('/shortenUrl', async (req, resp) => {
    try {
        const url = req.body.url;
        // console.log("url received:", url);
        const shortCode = await generateShortCode();
        // console.log("generated short code: ", shortCode);
        const res = await URL.create({
            shortCode: shortCode, 
            originalUrl: url
        })
        return resp.status(200).json({ success: true, data: res });
    } catch (e) {
        console.log(e);
        return resp.status(500).json({ error: e.message });
    }
})
router.get(`/:shortCode`, async(req, resp) => {
    try {
        console.log("shorcode: ",req.params.shortCode)
        const url = await URL.findOne({shortCode: req.params.shortCode})
        console.log(url)
        return resp.status(200).json({ success: true, data: url });
    } catch (e) {
        console.log(e);
        return resp.status(500).json({ error: e.message });
    }
})


export default router