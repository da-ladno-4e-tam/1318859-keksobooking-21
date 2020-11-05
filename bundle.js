(()=>{"use strict";window.utils={getContent:function(e,n,t,i){const o=document.createDocumentFragment();n.forEach((function(n){o.appendChild(e(n))})),t.insertBefore(o,t.children[i])},disableElementsInArray:function(e,n){e.forEach((function(e){e.disabled=n}))},debounce:function(e){let n;return function(...t){n&&window.clearTimeout(n),n=window.setTimeout((function(){e(...t)}),500)}}},window.backend={load:function(e,n){const t=new XMLHttpRequest;t.responseType="json",t.timeout=1e4,t.addEventListener("load",(function(){200===t.status?e(t.response):n("Статус ответа: "+t.status+" "+t.statusText)})),t.addEventListener("error",(function(){n("Произошла ошибка соединения")})),t.addEventListener("timeout",(function(){n("Кексоботы не успели найти вам жильё :(")})),t.open("GET","https://21.javascript.pages.academy/keksobooking/data"),t.send()},save:function(e,n,t){const i=new XMLHttpRequest;i.responseType="json",i.timeout=1e4,i.addEventListener("load",(function(){200===i.status?n():t()})),i.addEventListener("error",(function(){t()})),i.addEventListener("timeout",(function(){t()})),i.open("POST","https://21.javascript.pages.academy/keksobooking"),i.send(e)}},(()=>{const e=document.querySelector("#pin").content.querySelector(".map__pin");window.pin={renderBadge:function(n){const t=e.cloneNode(!0);return t.style=`left: ${n.location.x+-25}px; top: ${n.location.y+-70}px;`,t.querySelector("img").src=n.author.avatar,t.querySelector("img").alt=n.offer.title,t}}})(),(()=>{const e={bungalow:{LOCAL_NAME:"Бунгало",MIN_PRICE:0},flat:{LOCAL_NAME:"Квартира",MIN_PRICE:1e3},house:{LOCAL_NAME:"Дом",MIN_PRICE:5e3},palace:{LOCAL_NAME:"Дворец",MIN_PRICE:1e4}},n=document.querySelector("#card").content.querySelector(".popup");function t(e,n){for(let t=0;t<n.length;t++){if(e.className.includes("--"+n[t])){e.style="display: inline-block";break}e.style="display: none"}}window.card={TYPES_OF_HOUSE:e,renderPopup:function(i){const o=n.cloneNode(!0),r=o.querySelector(".popup__features"),d=o.querySelector(".popup__photos"),a=d.children[0];o.classList.add("hidden"),o.querySelector(".popup__title").textContent=i.offer.title,o.querySelector(".popup__text--address").textContent=i.offer.address,o.querySelector(".popup__text--price").textContent=i.offer.price+" ₽/ночь",o.querySelector(".popup__type").textContent=e[i.offer.type].LOCAL_NAME,o.querySelector(".popup__text--capacity").textContent=`${i.offer.rooms} комнаты для ${i.offer.guests} гостей`,o.querySelector(".popup__text--time").textContent=`Заезд после ${i.offer.checkin}, выезд до ${i.offer.checkout}`;for(let e=0;e<r.children.length;e++)i.offer.features.length<1?r.style="display: none":t(r.children[e],i.offer.features);var s,c,u;return o.querySelector(".popup__description").textContent=i.offer.description,s=i.offer.photos,c=a,u=d,s.length<1?c.parentNode.removeChild(c):(c.src=s[0],s.forEach((function(e,n){const t=c.cloneNode(!0);u.append(t),u.children[n].src=e}))),o.querySelector(".popup__avatar").src=i.author.avatar,o}}})(),(()=>{const e="Enter",n="Escape",t=1e6,i={any:{MIN_COST:0,MAX_COST:t},low:{MIN_COST:0,MAX_COST:1e4},middle:{MIN_COST:1e4,MAX_COST:5e4},high:{MIN_COST:5e4,MAX_COST:1/0}},o=document.querySelector(".map"),r=document.querySelector("main"),d=o.querySelector(".map__filters"),a=d.querySelectorAll("select"),s=d.querySelectorAll("fieldset"),c=document.querySelector(".ad-form"),u=c.querySelector(".ad-form__photo"),l=c.querySelector(".ad-form-header__preview img"),m=c.querySelectorAll("fieldset"),w=c.querySelector("#address"),f=c.querySelector(".ad-form__reset"),p=o.querySelector(".map__pin--main"),v=o.querySelector(".map__pins"),y=Math.round(p.offsetLeft+p.offsetWidth/2),E=Math.round(p.offsetTop+p.offsetHeight/2),h=document.querySelector("#success").content.querySelector(".success"),_=document.querySelector("#error").content.querySelector(".error");let L=[],C=[],S=[];function A(){S=window.filter.selectAdverts(C),window.utils.getContent(window.pin.renderBadge,S,v,0),window.utils.getContent(window.card.renderPopup,S,o,1),function(e){for(let n=0;n<e.length;n++)L.push(o.children[n+1])}(S),L.forEach((function(n,t){var i,o;v.children[t].addEventListener("click",(i=n,o=v.children[t],function(){k(i),O(),o.classList.add("map__pin--active"),document.addEventListener("keydown",T)}),!1),v.children[t].addEventListener("keydown",function(n,t){return function(i){i.key===e&&(i.preventDefault(),k(n),O(),t.classList.add("map__pin--active")),document.addEventListener("keydown",T)}}(n,v.children[t]),!1)})),L.forEach((function(e){e.querySelector(".popup__close").addEventListener("click",x(e),!1),e.querySelector(".popup__close").addEventListener("keydown",j(e),!1)})),b()}function g(){for(let e=S.length-1;e>=0;e--)v.children[e].parentNode.removeChild(v.children[e]),o.children[e+1].parentNode.removeChild(o.children[e+1]);S=[],L=[]}function q(n){n.key!==e&&1!==n.which||(o.classList.remove("map--faded"),c.classList.remove("ad-form--disabled"),window.utils.disableElementsInArray(m,!1),window.backend.load(N,P),p.removeEventListener("keydown",q),p.removeEventListener("mousedown",q))}function I(n){n.key!==e&&1!==n.which||(window.backend.load(N,P),o.classList.remove("map--faded"),c.classList.remove("ad-form--disabled"),window.utils.disableElementsInArray(a,!1),window.utils.disableElementsInArray(s,!1),window.utils.disableElementsInArray(m,!1),L.forEach((function(e){v.children[e].classList.remove("hidden")})),p.removeEventListener("mousedown",I),p.removeEventListener("keydown",I))}function N(e){window.utils.disableElementsInArray(a,!1),window.utils.disableElementsInArray(s,!1),C=e,function(e){for(let n=e.length-1;n>=0;n--)e[n].offer||e.splice(n,1)}(C),A()}function P(e){const n=document.createElement("div");n.classList.add("request-error"),n.textContent=e,o.insertAdjacentElement("afterbegin",n)}function b(){L.forEach((function(e,n){o.children[n+1].classList.add("hidden")}))}function O(){L.forEach((function(e,n){v.children[n].classList.remove("map__pin--active")}))}function k(e){b(),e.classList.remove("hidden")}function M(e){e.classList.add("hidden"),e.querySelector(".popup__close").removeEventListener("click",x(e)),e.querySelector(".popup__close").removeEventListener("keydown",j(e))}function x(e){return function(){M(e),O()}}function j(n){return function(t){t.key===e&&(t.preventDefault(),M(n),O())}}function T(e){e.key===n&&(e.preventDefault(),O(),document.removeEventListener("keydown",T),b())}function F(){window.utils.disableElementsInArray(a,!0),window.utils.disableElementsInArray(s,!0),window.utils.disableElementsInArray(m,!0),w.setAttribute("value",`${y}, ${E}`)}function H(){u.children[0]&&u.children[0].remove(),l.src="img/muffin-grey.svg",o.classList.add("map--faded"),d.reset(),g(),window.filter.cancelChanges(),p.style.left="570px",p.style.top="375px",c.classList.add("ad-form--disabled"),F(),c.reset(),b(),L.forEach((function(e){v.children[e].classList.add("hidden")})),O(),p.addEventListener("mousedown",I),p.addEventListener("keydown",I)}function Y(){H(),V(h)}function R(){V(_)}function V(e){const n=document.createDocumentFragment();n.appendChild(function(e){return e.cloneNode(!0)}(e)),r.insertBefore(n,r.children[0]),document.addEventListener("click",X),document.addEventListener("keydown",$),e===_&&r.querySelector(".error__button").addEventListener("mousedown",X)}function X(){r.children[0].parentNode.removeChild(r.children[0]),document.removeEventListener("click",X),document.removeEventListener("keydown",$)}function $(e){e.key===n&&(r.children[0].parentNode.removeChild(r.children[0]),document.removeEventListener("click",X),document.removeEventListener("keydown",$))}F(),p.addEventListener("mousedown",q),p.addEventListener("keydown",q),c.addEventListener("submit",(function(e){e.preventDefault(),window.backend.save(new FormData(c),Y,R)})),f.addEventListener("click",H),window.main={MAX_PRICE:t,MAX_SIMILAR_ADVERT_COUNT:5,ANY_CHOICE:"any",PRICE_VALUES:i,map:o,mapFilters:d,adForm:c,similarListElement:v,majorPin:p,addressInput:w,roomPreviewContainer:u,avatarPreview:l,adverts:C,clearAdverts:g,updateAdverts:A}})(),(()=>{const e=["gif","jpg","jpeg","png"],n=window.main.adForm.querySelector(".ad-form__field input[type=file]"),t=window.main.adForm.querySelector(".ad-form__upload input[type=file]");function i(e){const n=document.createElement("img");window.main.roomPreviewContainer.children[0]&&window.main.roomPreviewContainer.children[0].remove(),window.main.roomPreviewContainer.appendChild(n),window.main.roomPreviewContainer.style.display="flex",window.main.roomPreviewContainer.style.alignItems="center",window.main.roomPreviewContainer.style.justifyContent="center",n.style.maxHeight="100%",n.style.maxWidth="100%",n.alt="Фото жилья",n.src=e.result}function o(e){window.main.avatarPreview.src=e.result}function r(n,t){const i=n.files[0],o=i.name.toLowerCase();if(e.some((function(e){return o.endsWith(e)}))){const e=new FileReader;e.addEventListener("load",(function(){t(e)})),e.readAsDataURL(i)}}n.addEventListener("change",(function(){r(n,o)})),t.addEventListener("change",(function(){r(t,i)}))})(),(()=>{const e=window.main.majorPin.offsetHeight+22;function n(e,n){window.main.addressInput.setAttribute("value",`${e}, ${n}`)}window.main.majorPin.addEventListener("mousedown",(function(t){t.preventDefault();let i={x:t.clientX,y:t.clientY},o=Math.round(window.main.majorPin.offsetLeft+window.main.majorPin.offsetWidth/2),r=Math.round(window.main.majorPin.offsetTop+e);function d(t){t.preventDefault();const d=i.x-t.clientX,a=i.y-t.clientY,s=o-d,c=r-a;o=Math.round(window.main.majorPin.offsetLeft+window.main.majorPin.offsetWidth/2),r=Math.round(window.main.majorPin.offsetTop+e),i={x:t.clientX,y:t.clientY},window.main.majorPin.style.top=window.main.majorPin.offsetTop-a+"px",window.main.majorPin.style.left=window.main.majorPin.offsetLeft-d+"px",n(s,c),s<=0&&(window.main.majorPin.style.left=-window.main.majorPin.offsetWidth/2+"px",n(0,c)),s>=window.main.similarListElement.offsetWidth&&(window.main.majorPin.style.left=window.main.similarListElement.offsetWidth-window.main.majorPin.offsetWidth/2+"px",n(window.main.similarListElement.offsetWidth,c)),c<=130&&(window.main.majorPin.style.top=130-e+"px",n(s,130)),c>=630&&(window.main.majorPin.style.top=630-e+"px",n(s,630))}window.main.addressInput.setAttribute("value",`${o}, ${r}`),document.addEventListener("mousemove",d),document.addEventListener("mouseup",(function e(n){n.preventDefault(),document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",e)}))}))})(),(()=>{const e=/\.(jpeg|jpg|png|webp)$/,n=window.main.adForm.querySelector("#avatar"),t=window.main.adForm.querySelector("#images"),i=window.main.adForm.querySelector("#title"),o=window.main.adForm.querySelector("#type"),r=window.main.adForm.querySelector("#price"),d=window.main.adForm.querySelector("#timein"),a=window.main.adForm.querySelector("#timeout"),s=window.main.adForm.querySelector("#room_number"),c=s.querySelector('option[value = "100"]'),u=window.main.adForm.querySelector("#capacity"),l={title:{minLength:"Заголовок должен быть не меньше 30 симв.",maxLength:"Заголовок должен быть не больше 100 симв."},price:`Максимальная цена за ночь не должна превышать ${window.main.MAX_PRICE} руб.`,capacity:"Измените количество комнат или гостей",images:'Выберите изображение формата "jpeg", "jpg", "webp" или "png"'};function m(){const e=Number(u.value),n=Number(s.value);u.setCustomValidity(e>n||n===Number(c.value)&&e!==n?l.capacity:""),u.reportValidity()}function w(n){n.addEventListener("input",(function(){const t=n.value;n.setCustomValidity(e.test(t)?"":l.images),n.reportValidity()}))}o.addEventListener("input",(function(){r.setAttribute("min",""+window.card.TYPES_OF_HOUSE[o.value].MIN_PRICE),r.placeholder=""+window.card.TYPES_OF_HOUSE[o.value].MIN_PRICE})),d.addEventListener("input",(function(){a.value=d.value})),a.addEventListener("input",(function(){d.value=a.value})),i.addEventListener("input",(function(){const e=i.value.length;e<30?i.setCustomValidity(l.title.minLength):e>100?i.setCustomValidity(l.title.maxLength):i.setCustomValidity(""),i.reportValidity()})),r.addEventListener("input",(function(){r.setCustomValidity(r.value>window.main.MAX_PRICE?l.price:""),r.reportValidity()})),u.addEventListener("input",m),s.addEventListener("input",m),w(n),w(t)})(),(()=>{const e=window.main.mapFilters.querySelector("#housing-type"),n=window.main.mapFilters.querySelector("#housing-price"),t=window.main.mapFilters.querySelector("#housing-rooms"),i=window.main.mapFilters.querySelector("#housing-guests"),o=window.main.mapFilters.querySelectorAll(".map__checkbox"),r=Array.from(o);let d=window.main.ANY_CHOICE,a=window.main.ANY_CHOICE,s=window.main.ANY_CHOICE,c=window.main.ANY_CHOICE,u=[];function l(){window.main.clearAdverts(),window.main.updateAdverts()}function m(e,n){return e.filter((function(e){return n.includes(e)}))}function w(e){return d===window.main.ANY_CHOICE?window.main.adverts:e.offer.type===d}function f(e){return a===window.main.ANY_CHOICE?window.main.adverts:e.offer.price>window.main.PRICE_VALUES[a].MIN_COST&&e.offer.price<=window.main.PRICE_VALUES[a].MAX_COST}function p(e){return s===window.main.ANY_CHOICE?window.main.adverts:e.offer.rooms===Number(s)}function v(e){return c===window.main.ANY_CHOICE?window.main.adverts:e.offer.guests===Number(c)}function y(e){let n=[];return u.forEach((function(t){n.push(e.offer.features.indexOf(t))})),!n.includes(-1)}e.addEventListener("change",window.utils.debounce((function(){d=e.value,l()}))),n.addEventListener("change",window.utils.debounce((function(){a=n.value,l()}))),t.addEventListener("change",window.utils.debounce((function(){s=t.value,l()}))),i.addEventListener("change",window.utils.debounce((function(){c=i.value,l()}))),r.forEach((function(e){e.addEventListener("change",window.utils.debounce((function(){if(e.checked)u.push(e.value);else{const n=u.indexOf(e.value);n>-1&&u.splice(n,1)}l()})))})),window.filter={selectAdverts:function(e){const n=e.filter(w),t=e.filter(f),i=e.filter(p),o=e.filter(v),r=e.filter(y);let d=m(n,t);return d=m(d,i),d=m(d,o),d=m(d,r),d.slice(0,window.main.MAX_SIMILAR_ADVERT_COUNT)},cancelChanges:function(){d=window.main.ANY_CHOICE,a=window.main.ANY_CHOICE,s=window.main.ANY_CHOICE,c=window.main.ANY_CHOICE,e.value=window.main.ANY_CHOICE,n.value=window.main.ANY_CHOICE,t.value=window.main.ANY_CHOICE,i.value=window.main.ANY_CHOICE,u=[]}}})()})();