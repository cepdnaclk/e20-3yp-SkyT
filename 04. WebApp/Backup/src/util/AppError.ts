class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    Object.setPrototypeOf(this, new.target.prototype); // Restore the prototype chain
  }
}
