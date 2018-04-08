# pixi-analog-stick

The aim of the project is to create an easy to use analog stick library for PIXI.js.

![capture](./capture.gif)

#### Install

```
$ npm install --save pixi-analog-stick
```

#### Usage

```javascript
import * as PIXI from 'pixi.js';
import PixiAnalogStick from 'pixi-analog-stick';

class AnalogStick extends PIXI.Container {
  constructor() {
    super();

    // AnalogStick
    this._analogStick = new PixiAnalogStick();
    this._analogStick.on('move', this._onMoveStick);
    this._analogStick.on('release', this._onReleaseStick);
    this.addChild(this._analogStick);
  }

  _onMoveStick = (stickData) => {
    console.info('move', stickData);
  };

  _onReleaseStick = () => {
    console.info('release', stickData);
  };
}

export default AnalogStick;
```

### Method

- **on(eventName:String, handler:Function)**

  Use to add events.

- **off(eventName:String, handler:Function)**

  Use to remove events.

- **dispose()**

  Use to dispose pixi-analog-stick.

### Event

- **move**

  Emit "move" event when move stick.

  **Property**
  - **x** : It is "x" position of stick.
  - **y** : It is "y" position of stick.
  - **angle** : It is the angle where the stick was knocked down.
  - **length** : It is the distance between the stick and the center.


- **release**

  Emit "release" event when stick is released.
