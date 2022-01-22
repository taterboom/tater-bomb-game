function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');
var Transform = function Transform() {
    "use strict";
    var position = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        x: 0,
        y: 0
    }, rotation = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    _classCallCheck(this, Transform);
    this.position = position;
    this.rotation = rotation;
};
var ActorId = 1;
var Actor = function() {
    "use strict";
    function Actor(param) {
        var transform = param.transform, gamePlay = param.gamePlay, player = param.player;
        _classCallCheck(this, Actor);
        this.transform = transform !== null && transform !== void 0 ? transform : new Transform();
        this.gamePlay = gamePlay;
        this.player = player;
        this.id = ActorId++;
    }
    _createClass(Actor, [
        {
            key: "onBeginPlay",
            value: function onBeginPlay() {}
        }
    ]);
    return Actor;
}();
var Pawn = function(Actor) {
    "use strict";
    _inherits(Pawn, Actor);
    var _super = _createSuper(Pawn);
    function Pawn() {
        _classCallCheck(this, Pawn);
        return _super.apply(this, arguments);
    }
    _createClass(Pawn, [
        {
            key: "draw",
            value: function draw() {}
        }
    ]);
    return Pawn;
}(Actor);
var GamePlay = function() {
    "use strict";
    function GamePlay(config) {
        _classCallCheck(this, GamePlay);
        this.actorMap = new Map();
        this.ctx = config.ctx;
        this.scene = Reflect.construct(config.sceneClass, [
            {
                gamePlay: this
            }
        ]);
        this.actorMap.set(this.scene.id, this.scene);
        this.onBeginPlay = config.onBeginPlay;
        this.player = Reflect.construct(config.playerClass, [
            {
                transform: config.playerConfig,
                gamePlay: this
            }
        ]);
        this.actorMap.set(this.player.id, this.player);
    }
    _createClass(GamePlay, [
        {
            key: "start",
            value: function start() {
                var _obj, ref;
                (ref = (_obj = this).onBeginPlay) === null || ref === void 0 ? void 0 : ref.call(_obj);
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.actorMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var actor = _step.value;
                        var ref1;
                        (ref1 = actor.onBeginPlay) === null || ref1 === void 0 ? void 0 : ref1.call(actor);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                this.tick();
            }
        },
        {
            key: "draw",
            value: function draw() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.actorMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var actor = _step.value;
                        var ref;
                        (ref = actor.draw) === null || ref === void 0 ? void 0 : ref.call(actor);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "tick",
            value: function tick() {
                var _this = this;
                this.ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.actorMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var actor = _step.value;
                        var ref;
                        (ref = actor.onTick) === null || ref === void 0 ? void 0 : ref.call(actor);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                this.draw();
                requestAnimationFrame(function() {
                    return _this.tick();
                });
            }
        },
        {
            key: "spawn",
            value: function spawn(actorClass, transform) {
                var actor = Reflect.construct(actorClass, [
                    {
                        transform: transform,
                        gamePlay: this,
                        player: this.player
                    }
                ]);
                this.actorMap.set(actor.id, actor);
                actor.onBeginPlay();
            }
        }
    ]);
    return GamePlay;
}();
var Player = function(Pawn) {
    "use strict";
    _inherits(Player, Pawn);
    var _super = _createSuper(Player);
    function Player() {
        _classCallCheck(this, Player);
        var _this;
        _this = _super.apply(this, arguments);
        _this.width = 20;
        _this.height = 20;
        _this.color = '#666';
        _this.active = false;
        return _this;
    }
    _createClass(Player, [
        {
            key: "draw",
            value: function draw() {
                var ctx1 = this.gamePlay.ctx;
                ctx1.save();
                ctx1.fillStyle = this.color;
                ctx1.fillRect(this.transform.position.x - this.width / 2, this.transform.position.y - this.height / 2, this.width, this.height);
                ctx1.restore();
            }
        },
        {
            key: "onBeginPlay",
            value: function onBeginPlay() {
                var _this = this;
                window.addEventListener('mousedown', function() {
                    _this.active = true;
                });
                window.addEventListener('mouseup', function() {
                    _this.active = false;
                });
            }
        },
        {
            key: "onTick",
            value: function onTick() {
                if (this.active) {
                    this.transform.position.x += 0.2;
                }
            }
        }
    ]);
    return Player;
}(Pawn);
var Scene = function(Pawn) {
    "use strict";
    _inherits(Scene, Pawn);
    var _super = _createSuper(Scene);
    function Scene() {
        _classCallCheck(this, Scene);
        return _super.apply(this, arguments);
    }
    _createClass(Scene, [
        {
            key: "draw",
            value: function draw() {
                this.gamePlay.ctx.fillStyle = '#f7f7f7';
                this.gamePlay.ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
            }
        }
    ]);
    return Scene;
}(Pawn);
var Enemy = function(Pawn) {
    "use strict";
    _inherits(Enemy, Pawn);
    var _super = _createSuper(Enemy);
    function Enemy() {
        _classCallCheck(this, Enemy);
        var _this;
        _this = _super.apply(this, arguments);
        _this.radius = 8;
        return _this;
    }
    _createClass(Enemy, [
        {
            key: "draw",
            value: function draw() {
                console.log('?');
                ctx.save();
                this.gamePlay.ctx.fillStyle = '#28bea0';
                ctx.beginPath();
                this.gamePlay.ctx.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, 2 * Math.PI, true);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        },
        {
            key: "onTick",
            value: function onTick() {
                this.transform.position.x += 0.1;
            }
        }
    ]);
    return Enemy;
}(Pawn);
var game = new GamePlay({
    ctx: ctx,
    playerClass: Player,
    playerConfig: new Transform({
        x: canvasEl.width / 2,
        y: canvasEl.height / 2
    }),
    sceneClass: Scene
});
game.onBeginPlay = function() {
    game.spawn(Enemy, new Transform({
        x: 100,
        y: 100
    }));
};
game.start();


//# sourceMappingURL=out.js.map