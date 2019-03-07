import { ICreateTotalScoreBoardInput, IFindTotalScoreBoardQuery, IFindTotalScoreBoardResult } from './interface';
import * as Joi from 'joi';
import repository from './repository';

const createScoreboard = async (body: ICreateTotalScoreBoardInput, _user: any): Promise<void> => {
    const validationRule = Joi.object().keys({
        userId: Joi.string().required(),
        points: Joi.number().required(),
        username: Joi.string().required(),
        profileImgUrl: Joi.string(),
    });
    const { error } = Joi.validate(body, validationRule, {
        allowUnknown: true,
    });
    if (error) {
        throw new Error(error.details[0].message);
    }
    // const isUserScoreboardExist = repository.isUserScoreboardExist({ userId: body.userId, quizId: body.quizId });
    // if (isUserScoreboardExist) {
    //     await repository.updateScoreboard(addModificationAuditInfo(user, body));
    //     return;
    // }
    await repository.createScoreboard(body);
};

const findScoreboard = async (query: IFindTotalScoreBoardQuery): Promise<IFindTotalScoreBoardResult> => {
    return await repository.findScoreboard(query);
};

export default {
    createScoreboard,
    findScoreboard,
};
