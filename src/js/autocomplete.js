/*
* @Author: yankangbg
* @Date:   2017-06-08 11:49:47
* @Last Modified by:   yankang
* @Last Modified time: 2019-07-26 09:20:01
*/

;(function(window, document){
	var autocomplete = function(inputId, config){
		var data, store, dataLen
		var currentIndex = -1, count = 0
		var config = config || {}
		var ipt = document.querySelector(inputId)
		var infoBox = document.createElement('div')
		var defaultConfig = {
			fuzzy: true,
			width: '',
			number: 6,
			lineHeight: 30,
			scroll: true,
			backgroundColor: '#F7F2EB',
			srcData: [],
			ajaxCallback: function(){}
		}
		var isObj = function(obj){
			return Object.prototype.toString.call(obj) === '[object Object]'
		}

        var _deepCopy = function(obj1, obj2){
        	var obj2 = obj2 || {}
        	for(var i in obj1){
        		if(!obj1.hasOwnProperty(i)){
        			continue
        		}
        		if(Object.prototype.toString.call(obj1[1]) === '[object Object]'){
        			_deepCopty(obj[i], obj[i])
        		}else{
        			obj2[i] = obj1[i]
        		}
        	}
        	return obj2
        }

		var getStyle = function(obj, attr){
			return obj.currentStyle? obj.currentStyle[attr]: document.defaultView.getComputedStyle(obj, null)[attr]
		}

		var init = function(){
			console.log(config.ajaxCallback.toString())
			config = _deepCopy(config, defaultConfig)
			console.log(config.ajaxCallback.toString())
			infoBox.id = 'autocomplete'
			infoBox.style.width = config.width? (config.width + 'px'): (ipt.offsetWidth - parseInt(getStyle(infoBox, 'border-width')) * 2 + 'px')
			infoBox.style.maxHeight = config.number * config.lineHeight + 'px'
			infoBox.style.overflow = config.scroll? 'auto': 'hidden'
			infoBox.style.marginTop = ipt.offsetHeight - parseInt(getStyle(infoBox, 'border-width')) + 'px'
			infoBox.style.marginLeft = ipt.offsetLeft - ipt.parentNode.offsetLeft + 'px'
			ipt.setAttribute('autocomplete', 'off')
		}

		var isParent = function(obj, parentObj) {
			while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
				if (obj == parentObj) {
					return true
				}
				obj = obj.parentNode
			}
			return false
		}

		var stopDefault = function(e) {
	        //阻止默认浏览器动作(W3C)
	        if(e && e.preventDefault) {
	            //火狐的 事件是传进来的e
	            e.preventDefault();
	        }else{
	        	//IE中阻止函数器默认动作的方式
	            //ie 用的是默认的event
	            event.returnValue = false
	        }
	    }

		var dataDisplay = function(data, val){
			var html = ''
			count = 0
			for(var i=0; i<data.length; ++i){
			//是否开启前端模糊搜索, 默认不开启
				if(config.fuzzy){
					if(data[i].indexOf(val.replace(/(^\s*)|(\s*$)/g, "")) !== -1 && val!=''){
						count += 1
						// 浏览器会自动在data加双引号会和json引号冲突, 特此用单引号
						html += "<p data='" + (isObj(store[i])? JSON.stringify(store[i]): store[i]) + "'>" + data[i] + "</p>"
					}
				}else{
					count += 1
					html += "<p data='" + (isObj(store[i])? JSON.stringify(store[i]): store[i]) + "'>" + data[i] + "</p>"
				}
			}
			if(html != ''){
				infoBox.innerHTML = html
			}else{
				count = 1
				infoBox.innerHTML = '<p class="nullResult">抱歉，找不到相关结果</p>'
				console.log(11)
			}
			infoBox.style.height = count * config.lineHeight + 'px'
			infoBox.style.display = 'block'
			var p = infoBox.getElementsByTagName('p')
			for(var i=0; i<p.length; ++i){
				p[i].style.lineHeight = config.lineHeight + 'px'
				p[i].style.height = config.lineHeight + 'px'
				p[i].addEventListener('mouseover', function(e){
					this.style.backgroundColor = config.backgroundColor
				}, false)
				p[i].addEventListener('mouseout', function(e){
					this.style.backgroundColor = '#fff'
				}, false)
			}
		}

		var getChild = function(parent, ele, num) {
			var _ele = Array.prototype.slice.call(parent.childNodes),
				eleArray = []
			//将父节点的子节点转换成数组_ele;eleArray为只储存元素节点的数组
			for (var i = 0, len = _ele.length; i < len; i++) {
				if (_ele[i].nodeType == 1) {
					eleArray.push(_ele[i]); //过滤掉非元素节点
				}
			}
			if (arguments.length === 2) {
				//如果只传入2个参数，则如果第二个参数是数字，则选取父节点下的第几个元素
				//如果第二个参数是字符串，则选取父节点下的所有参数代表的节点
				if (typeof arguments[1] === "string") {
					_ele = Array.prototype.slice.call(parent.getElementsByTagName(arguments[1]))
					return _ele
				} else if (typeof arguments[1] === "number") {
					return eleArray[arguments[1]]
				}
			} else {
				//如果参数齐全，则返回第几个某节点,索引从0开始
				_ele = Array.prototype.slice.call(parent.getElementsByTagName(ele))
				return _ele[num]
			}
		}

		ipt.parentNode.insertBefore(infoBox, ipt.parentNode.childNodes[0])
		ipt.addEventListener('click', function(e){
			init()
		}, false)
		ipt.addEventListener('oninput' in ipt? 'input': 'keyup', function(e){
			var val = ipt.value
			if(typeof(config.srcData) === 'function'){
				if(val != ''){
					config.srcData(function(displayData, storageData){
						data = displayData
						store = storageData
						dataDisplay(data, val)
					})
				}else{
					infoBox.innerHTML = ''
					infoBox.style.display = 'none'
				}
			}else{
				data = config.srcData
				store = ''
				dataDisplay(data, val)
			}
		}, false)

		infoBox.addEventListener('click', function(e){
			var $target = e.target
			if(e.target.className != 'nullResult'){
				ipt.value = $target.textContent
			}
			ipt.setAttribute('data', $target.getAttribute('data'))
			if(infoBox.innerHTML.toString().search(/nullResult/) !== -1){
				config.ajaxCallback() = function(){}
			}
			config.ajaxCallback()
			infoBox.style.display = 'none'
		}, false)

		document.addEventListener('click', function(e){
			if(e.target == ipt || !isParent(e.target, ipt)){
				infoBox.style.display = 'none'
			}
		}, false)

		document.addEventListener('keydown', function(e){
			var p = infoBox.getElementsByTagName('p')
			for(var i=0; i<p.length; ++i){
				p[i].style.backgroundColor = '#fff'
			}
			if (infoBox.style.display == "block"){
			    //38:上  40:下
			    if(event.keyCode == 38){
			        stopDefault(event)  //不阻止光标户向前移动
			        stopDefault(event)
			        if(currentIndex > 0){
			        	currentIndex--
			        }else{
			        	currentIndex = count - 1
			        }
			        if(currentIndex < config.number){
			        	infoBox.scrollTop = 0
			        }else{
			        	infoBox.scrollTop = config.lineHeight * (currentIndex - config.number + 1)
			        }
			        var currentDom = getChild(infoBox, 'p', currentIndex)
			        currentDom.style.backgroundColor = config.backgroundColor
			        ipt.value = currentDom.textContent
			    }else if(event.keyCode == 40){
			        stopDefault(event)
			        if(currentIndex < count - 1){
			        	currentIndex++
			        }else{
			        	currentIndex = 0
			        }
			        if(currentIndex >= config.number){
			        	infoBox.scrollTop = config.lineHeight * (currentIndex - config.number + 1)
			        }else{
			        	infoBox.scrollTop = 0
			        }
			        var currentDom = getChild(infoBox, 'p', currentIndex)
			        currentDom.style.backgroundColor = config.backgroundColor
			        ipt.value = currentDom.textContent
			    }else if(event.keyCode == 13){
			    	if(currentIndex != -1){
			    		var $target = getChild(infoBox, 'p', currentIndex)
			    		if($target.className != 'nullResult'){
			    			ipt.value = $target.textContent
			    		}
			    		ipt.setAttribute('data', $target.getAttribute('data'))
			    		config.ajaxCallback()
			    		infoBox.style.display = 'none'
			    		currentIndex = -1
			    	}
			    }
			}
		}, false)
	}
	window.autocomplete = autocomplete
})(window, document, undefined);
