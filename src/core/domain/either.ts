export type Left<L> = [L, undefined];

export type Right<R> = [undefined, R];

export type EitherType = Left<unknown> | Right<unknown>;

export class Either<L, R> {
  private _left?: L;
  private _right?: R;

  private constructor(left?: L, right?: R) {
    this._left = left;
    this._right = right;
  }

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(value, undefined) as Either<L, R>;
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(undefined, value) as Either<L, R>;
  }

  isLeft(): this is Left<L> {
    return this._left !== undefined;
  }

  isRight(): this is Right<R> {
    return this._right !== undefined;
  }

  getLeft<T extends L>(): T {
    return this._left! as T;
  }

  getRight<T extends R>(): T {
    return this._right! as T;
  }

  static async handle<L, R>(fn: () => Promise<R>): Promise<Either<L, R>> {
    try {
      const response = await fn();

      return Either.right<L, R>(response);
    } catch (error) {
      return Either.left<L, R>(error as L);
    }
  }
}
