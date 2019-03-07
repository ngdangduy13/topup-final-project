export interface ScoreboardState {
    scoreboard: ScoreboardItem[];
    quizScoreboard: ScoreboardItem[];
}

export interface ScoreboardItem {
    userId: string;
    username: string;
    points: number;
    quizId: string;
    _id: string;
    isCurrentUser: boolean;
    profileImgUrl: string;
}
