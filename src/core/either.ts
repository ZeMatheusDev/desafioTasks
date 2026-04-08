export type Left<L> = {
  readonly isLeft: true;
  readonly isRight: false;
  readonly value: L;
};

export type Right<R> = {
  readonly isLeft: false;
  readonly isRight: true;
  readonly value: R;
};

export type Either<L, R> = Left<L> | Right<R>;

export function left<L, R = never>(value: L): Either<L, R> {
  return {
    isLeft: true,
    isRight: false,
    value,
  };
}

export function right<R, L = never>(value: R): Either<L, R> {
  return {
    isLeft: false,
    isRight: true,
    value,
  };
}
