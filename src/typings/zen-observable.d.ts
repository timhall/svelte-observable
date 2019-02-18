declare module 'zen-observable' {
  export type SubscriberFunction = any;
  export type Observer = any;
  export type Subscription = any;
  export type Function = any;

  export default class Observable {
    constructor(subscriber: SubscriberFunction);

    subscribe(observer: Observer): Subscription;
    subscribe(
      onNext: Function,
      onError?: Function,
      onComplete?: Function
    ): Subscription;

    [Symbol.observable](): Observable;

    static of(...items: any[]): Observable;
    static from(observable: any): Observable;
  }
}
