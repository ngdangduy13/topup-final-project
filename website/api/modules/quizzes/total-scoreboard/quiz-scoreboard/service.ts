import { IFindQuizzScoreBoardQuery, IFindQuizzScoreBoardResult, ICreateQuizzScoreBoardInput, IFindQuizzScoreBoardDetail } from './interface';
import repository from './repository';
import * as Joi from 'joi';
// import { addModificationAuditInfo } from '../../../core/helpers';
import * as moment from 'moment';

const findScoreboard = async (query: IFindQuizzScoreBoardQuery): Promise<IFindQuizzScoreBoardResult> => {
    const scoreboard = await repository.findScoreboard(query);
    let data: IFindQuizzScoreBoardDetail[] = await scoreboard.data;
    const listScoreboardId: string[] = [];
    if (data.length > 1) {
        for (let i = 0; i < data.length; i++) {
            let firstSubmit = data[i].firstSubmittedAt;
            let earliestScoreboardId = data[i]._id;
            for (let j = i + 1; j < data.length; j++) {
                if (data[i].userId !== data[j].userId || data[i].quizId !== data[j].quizId) {
                    continue;
                } else if (moment(firstSubmit).format('x') >= moment(data[j].firstSubmittedAt).format('x')) {
                    firstSubmit = data[j].firstSubmittedAt;
                    earliestScoreboardId = data[j]._id;
                }
            }
            listScoreboardId.push(earliestScoreboardId);
        }

        data = data.filter((_scoreboard: IFindQuizzScoreBoardDetail) => listScoreboardId.filter((id: string) => _scoreboard._id.toString() === id.toString()).length > 0);
    }

    return { data, total: data.length };
};

const createScoreboard = async (body: ICreateQuizzScoreBoardInput, _user: any): Promise<void> => {
    const validationRule = Joi.object().keys({
        quizId: Joi.string().required(),
        userId: Joi.string().required(),
        points: Joi.number().required(),
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

export default {
    findScoreboard,
    createScoreboard,
};
