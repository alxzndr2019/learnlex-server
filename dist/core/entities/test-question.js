"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestQuestion = void 0;
class TestQuestion {
    constructor(id, sessionId, question, choices, correctAnswer, explanation, userAnswer, isCorrect) {
        this.id = id;
        this.sessionId = sessionId;
        this.question = question;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.userAnswer = userAnswer;
        this.isCorrect = isCorrect;
    }
}
exports.TestQuestion = TestQuestion;
