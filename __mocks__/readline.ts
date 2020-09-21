/**
 * readline mock Interface
 */
export interface MockInterface {
  id: number;
  on: (evt: string, cb: (...args: any[]) => void) => MockInterface,
  pause: () => void,
  close: () => void,
  setPrompt: (prompt: string) => void;
  prompt: () => void;
}

/**
 * Internal mock data
 */
let curID: number = 0;
const mockCBs: Map<string, (...args: any[]) => void> = new Map();
let mockResp: Array<{evt: string, data: string;}> = [];

/**
 * readline mock implementation
 */
const rMock: MockInterface = {
  id: ++curID,
  on: jest.fn().mockImplementation((evt: string, cb: (...args: any[]) => void): MockInterface => {
    mockCBs.set(evt, cb);
    return rMock;
  }),
  pause: jest.fn().mockImplementation((): void => {}),
  close: jest.fn().mockImplementation((): void => {}),
  setPrompt: jest.fn().mockImplementation((prompt: string): void => {}),
  prompt: jest.fn().mockImplementation((): void => {
    //console.log(`${Date.now().toString()}::prompt(): ID: ${rMock.id} MockOns: ${mockCBs.size} MockQueue: ${mockResp.length}`);
    const resp = mockResp.shift();

    if (resp) {
      // get mock cb based event
      const cb = mockCBs.get(resp.evt);

      if (cb) {
        cb(resp.data);
      } else {
        throw new Error(`Event ${resp.evt} is not defined`);
      }
    } else {
      throw new Error(`No more input in the queue`);
    }
  })
};

/**
 * readline mock
 */
export interface MockReadline {
  createInterface: () => MockInterface,
  clearMock: () => void,
  addEvent: (evt: string, data?: any) => void
}

// readline mock implementation
const rlMock: MockReadline =  {
  createInterface: jest.fn().mockReturnValue(rMock),
  clearMock: () => {
    // clear responses
    //console.log(`${Date.now().toString()}::clearMock(): ID: ${rMock.id} MockOns: ${mockCBs.size} MockQueue: ${mockResp.length}`);
    mockResp = [];
  },
  addEvent: (evt: string, data?: any) => {
    //console.log(`${Date.now().toString()}::addEvent(): ID: ${rMock.id} MockOns: ${mockCBs.size} MockQueue: ${mockResp.length}`);
    mockResp.push({evt, data});
  }
};

// export
export default rlMock;
