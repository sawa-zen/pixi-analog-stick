import * as PIXI from 'pixi.js';
import Victor from 'victor';

const EVENT_NAME = {
  MOUSE_DOWN:        'mousedown',
  MOUSE_UP:          'mouseup',
  MOUSE_MOVE:        'mousemove',
  MOUSE_UP_OUTSIDE:  'mouseupoutside',
  TOUCH_START:       'touchstart',
  TOUCH_END:         'touchend',
  TOUCH_MOVE:        'touchmove',
  TOUCH_END_OUTSIDE: 'touchendoutside',
};

const PUBLIC_EVENT_NAME = {
  MOVE: 'move',
  RELEASE: 'release',
};

class PixiAnalogStick extends PIXI.Container {
  constructor() {
    super();

    this._radius = 60;
    this._stickRadius = 30;
    this._isDragging = false;
    this._startPosX = 0;
    this._startPosY = 0;

    this.width = 300;
    this.height = 300;
    this.interactive = true;

    this._tapArea = new PIXI.Graphics();
    this._tapArea.beginFill(0xff0000);
    this._tapArea.drawRect(-250, -250, 500, 500);
    this._tapArea.endFill();
    this._tapArea.alpha = 0;
    this._tapArea.interactive = true;
    this.addChild(this._tapArea);

    this._bg = new PIXI.Graphics();
    this._bg.beginFill(0xabafb8);
    this._bg.drawCircle(0, 0, this._radius);
    this._bg.endFill();
    this._bg.interactive = true;
    this._bg.buttonMode = true;
    this.addChild(this._bg);

    this._stick = new PIXI.Graphics();
    this._stick.beginFill(0x333333);
    this._stick.drawCircle(0, 0, this._stickRadius);
    this._stick.endFill();
    this._stick.interactive = true;
    this._stick.buttonMode = true;
    this.addChild(this._stick);

    this._stick.on(EVENT_NAME.MOUSE_DOWN, this._onTouchStart);
    this._stick.on(EVENT_NAME.TOUCH_START, this._onTouchStart);
    this._bg.on(EVENT_NAME.MOUSE_DOWN,  this._onTouchStart);
    this._bg.on(EVENT_NAME.TOUCH_START, this._onTouchStart);
    this.on(EVENT_NAME.MOUSE_UP,  this._onTouchEnd);
    this.on(EVENT_NAME.TOUCH_END, this._onTouchEnd);
    this.on(EVENT_NAME.MOUSE_MOVE, this._onTouchMove);
    this.on(EVENT_NAME.TOUCH_MOVE, this._onTouchMove);
    this.on(EVENT_NAME.MOUSE_UP_OUTSIDE,  this._onTouchEndOutside);
    this.on(EVENT_NAME.TOUCH_END_OUTSIDE, this._onTouchEndOutside);
  }

  dispose() {
    if(this._stick) {
      this._stick.removeAllListeners();
      this._bg.removeAllListeners();
      this.removeChild(this._stick);
      this.removeChild(this._bg);
      this._stick.destroy();
      this._stick = null;
    }
    this.removeAllListeners();
  }

  reset() {
    this._touchId = null;
    this._isDragging = false;

    this._stick.x = 0;
    this._stick.y = 0;
  }

  _release() {
    this.reset();
    this.emit(PUBLIC_EVENT_NAME.RELEASE);
  }

  _onTouchStart = (event) => {
    this._touchId = event.data.identifier;
    this._isDragging = true;

    let touchPos = event.data.getLocalPosition(this);
    this._startPosX = touchPos.x;
    this._startPosY = touchPos.y;
  };

  _onTouchMove = (event) => {
    if(!this._checkEvent(event)) {
      return;
    }

    if(!this._isDragging) {
      return;
    }

    let posision = event.data.getLocalPosition(this);
    let x = posision.x - this._startPosX,
        y = posision.y - this._startPosY;
    let vec = new Victor(x, y);
    let angle = vec.angle() * 180 / Math.PI;

    if(vec.length() > this._radius - this._stickRadius) {
      let v = vec.normalize().multiplyScalar(this._radius - this._stickRadius);
      this._stick.x = v.x;
      this._stick.y = v.y;
    } else {
      this._stick.x = x;
      this._stick.y = y;
    }

    this.emit(PUBLIC_EVENT_NAME.MOVE, {
      x: x,
      y: y,
      angle: angle,
      length: vec.length()
    });
  };

  _onTouchEnd = (event) => {
    event.stopPropagation();

    if(!this._checkEvent(event)) {
      return;
    }

    if(!this._isDragging) {
      return;
    }

    this._release();
  };

  _onTouchEndOutside = (event) => {
    event.stopPropagation();

    if(!this._checkEvent(event)) {
      return;
    }

    if(!this._isDragging) {
      return;
    }

    this._release();
  };

  _checkEvent(event) {
    if(event.type.match(/mouse/)) {
      return true;
    }

    if(this._touchId == event.data.identifier) {
      return true;
    }

    return false;
  }
}

export default PixiAnalogStick;
