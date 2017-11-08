import bind from './bind'
import './index.css'
import mouseWheel from './mouseWheel'
var doc = document;
var _wheelData = -1;
var mainBox = doc.getElementById('mainBox');

var AddScroll = function () {
    this.init.apply(this, arguments);
}
AddScroll.prototype.init = function (mainBox, contentBox, className) {
    var mainBox = doc.getElementById(mainBox);
    var contentBox = doc.getElementById(contentBox);
    //创建滚动条
    var scrollDiv = this._createScroll(mainBox, className);
    //调整滚动条
    this._resizeScorll(scrollDiv, mainBox, contentBox);
    //拖动滚动条
    this._tragScroll(scrollDiv, mainBox, contentBox);
    this._wheelChange(scrollDiv, mainBox, contentBox);
}
//创建滚动条
AddScroll.prototype._createScroll = function (mainBox, className) {
    var _scrollBox = doc.createElement('div')
    var _scroll = doc.createElement('div');
    var span = doc.createElement('span');
    _scrollBox.appendChild(_scroll);
    _scroll.appendChild(span);
    _scroll.className = className;
    mainBox.appendChild(_scrollBox);
    return _scroll;
}

//调整滚动条
AddScroll.prototype._resizeScorll = function (element, mainBox, contentBox) {
    var p = element.parentNode;
    var conHeight = contentBox.offsetHeight;
    var _width = mainBox.clientWidth;
    var _height = mainBox.clientHeight;
    var _scrollWidth = element.offsetWidth;
    var _left = _width - _scrollWidth;
    p.style.width = _scrollWidth + "px";
    p.style.height = _height + "px";
    p.style.left = _left + "px";
    p.style.position = "absolute";
    p.style.background = "#ccc";


    contentBox.style.width = (mainBox.offsetWidth - _scrollWidth) + "px";

    var _scrollHeight = parseInt(_height * (_height / conHeight));
    if (_scrollHeight >= mainBox.clientHeight) {
        element.parentNode.style.display = "none";
    }
    element.style.height = _scrollHeight + "px";
}
//拖动滚动条
AddScroll.prototype._tragScroll = function (element, mainBox, contentBox) {
    var mainHeight = mainBox.clientHeight;
    element.onmousedown = function (event) {
        var _this = this;
        var _scrollTop = element.offsetTop;
        var e = event || window.event;
        var top = e.clientY;
        //this.onmousemove=scrollGo;
        document.onmousemove = scrollGo;
        document.onmouseup = function (event) {
            this.onmousemove = null;
        }
        function scrollGo(event) {
            var e = event || window.event;
            var _top = e.clientY;
            var _t = _top - top + _scrollTop;
            if (_t > (mainHeight - element.offsetHeight)) {
                _t = mainHeight - element.offsetHeight;
            }
            if (_t <= 0) {
                _t = 0;
            }
            element.style.top = _t + "px";
            contentBox.style.top = -_t * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
            _wheelData = _t;
        }
    }
    element.onmouseover = function () {
        this.style.background = "#444";
    }
    element.onmouseout = function () {
        this.style.background = "#666";
    }
}
//鼠标滚轮滚动，滚动条滚动
AddScroll.prototype._wheelChange = function (element, mainBox, contentBox) {
    var node = typeof mainBox == "string" ? $(mainBox) : mainBox;
    var flag = 0, rate = 0, wheelFlag = 0;
    if (node) {
        mouseWheel(node, function (data) {
            wheelFlag += data;
            if (_wheelData >= 0) {
                flag = _wheelData;
                element.style.top = flag + "px";
                wheelFlag = _wheelData * 12;
                _wheelData = -1;
            } else {
                flag = wheelFlag / 12;
            }
            if (flag <= 0) {
                flag = 0;
                wheelFlag = 0;
            }
            if (flag >= (mainBox.offsetHeight - element.offsetHeight)) {
                flag = (mainBox.clientHeight - element.offsetHeight);
                wheelFlag = (mainBox.clientHeight - element.offsetHeight) * 12;
            }
            element.style.top = flag + "px";
            contentBox.style.top = -flag * (contentBox.offsetHeight / mainBox.offsetHeight) + "px";
        });
    }
}

window.AddScroll=AddScroll
// new AddScroll('mainBox', 'content', 'scrollDiv');