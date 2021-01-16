import { useState } from 'react';

export default class useShare {
  static state;

  static setState;

  constructor(initialValue) {
    const [state, setState] = useState(initialValue);
    useShare.state = state;
    useShare.setState = setState;
  }
}
