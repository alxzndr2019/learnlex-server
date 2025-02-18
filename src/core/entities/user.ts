export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public picture: string,
    public googleId: string,
    public tokens: number = 0,
    public role: string = "user",
    public completedSessions: string[] = [],
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
