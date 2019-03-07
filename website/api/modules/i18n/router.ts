import * as express from 'express';
import i18nService from './service';

const i18nRouter = express.Router();

i18nRouter.get('/get-language', async (req, res) => {
    try {
        const result = await i18nService.getLanguage(req.query);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({
            errorMessage: err.message
        });
    }
})

export default i18nRouter;