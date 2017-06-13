/*
* @Author: yankang
* @Date:   2017-06-08 11:49:47
* @Last Modified by:   yankang
* @Last Modified time: 2017-06-13 17:00:00
*/

;(function(window, document){
	var autocomplete = function(inputId, config){
		var data, store
		var config = config || {}
		var ipt = document.querySelector(inputId)
		var infoBox = document.createElement('div')
		var defaultConfig = {
			fuzzy: true,
			width: '',
			number: 6,
			lineHeight: 20,
			srcData: []
		}
		var isObj = function(obj){
			return Object.prototype.toString.call(obj) === '[object Object]'
		}

		var extend = function(obj) {
            var newobj = JSON.parse(JSON.stringify(defaultConfig))
            for (var i in obj) {
                newobj[i] = obj[i]
            }
            return newobj
        }

		var getStyle = function(obj, attr){
			return obj.currentStyle? obj.currentStyle[attr]: document.defaultView.getComputedStyle(obj, null)[attr]
		}

		var init = function(){
			config = extend(config)
			infoBox.style.width = config.width? config.width: ipt.offsetWidth - parseInt(getStyle(infoBox, 'border-width')) * 2 + 'px'
			infoBox.style.maxHeight = config.number * config.lineHeight + 'px'
			ipt.setAttribute('autocomplete', 'off')
		}

		var dataDisplay = function(data, val){
			var html = ''
			var count = 0
			for(var i=0; i<data.length; ++i){
			//是否开启前端模糊搜索, 默认不开启
				if(config.fuzzy){
					if(data[i].indexOf(val) !== -1 && val!=''){
						count += 1
						// 浏览器会自动在data加双引号会和json引号冲突, 特此用单引号
						html += "<span data='" + (isObj(store[i])? JSON.stringify(store[i]): store[i]) + "'>" + data[i] + "</span>"
					}
				}else{
					count += 1
					html += "<span data='" + (isObj(store[i])? JSON.stringify(store[i]): store[i]) + "'>" + data[i] + "</span>"
				}
			}
			infoBox.style.height = count * config.lineHeight + 'px'
			if(html != ''){
				infoBox.innerHTML = html
				infoBox.style.display = 'block'
			}else{
				infoBox.innerHTML = ''
				infoBox.style.display = 'none'
			}
		}

		infoBox.className = 'autocomplete'
		ipt.parentNode.insertBefore(infoBox, ipt)
		ipt.addEventListener('click', function(e){
			init()
		}, false)

		ipt.addEventListener('input', function(e){
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
			ipt.value = $target.textContent
			ipt.setAttribute('data', $target.getAttribute('data'))
			infoBox.style.display = 'none'
		}, false)
	}
	window.autocomplete = autocomplete
})(window, document, undefined);
