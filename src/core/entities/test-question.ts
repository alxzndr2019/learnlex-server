export class TestQuestion {
  constructor(
    public readonly id: string,
    public readonly sessionId: string,
    public question: string,
    public choices: string[],
    public correctAnswer: number,
    public explanation: string,
    public userAnswer?: number,
    public isCorrect?: boolean
  ) {}
}
