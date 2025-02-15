export type Modify<T, R> = Omit<T, keyof R> & R;

export type WithTotal<T> = T & { total: number };
