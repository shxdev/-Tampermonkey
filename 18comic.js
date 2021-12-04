// ==UserScript==
// @name         18comic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        /^https?:\/\/18comic.org\//
// @icon         https://www.google.com/s2/favicons?domain=18comic.org
// @grant        GM_addElement
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @connect      cdn-msp.18comic.org
// ==/UserScript==

(function() {
    'use strict';
    const fn_18comic=function(){
        GM_log("Match 18COMIC");
        const fn_blockAD=function(){
            try{
                const selector="div.well.d18912-2_43.hidden-xs"
                +",div#wrapper div.container>div.row:nth-child(4)";
                document.querySelectorAll(selector).forEach((el)=>{
                    el.remove();
                });

            }catch(e){}

            window.setTimeout(fn_blockAD,1000);
        }
        let url=null;
        const fn_checkepisode=function(){
            let r=document.querySelector('.episode>ul');
            if(r){
                r=r.querySelectorAll('a');
            }else{
                r=document.querySelector('a.reading');
                r=r?[r]:null;
            }
            if(!r){
                const re_href=/\/photo\/(\d+)/;
                if(re_href.test(href)){
                   r=document.createElement('a');
                   r.setAttribute('href',href);
                   r=[r];
                }
            }
            if(!r)return;

            const el_div=document.createElement("div");
            el_div.style.position="fixed";
            el_div.style.left="5px";
            el_div.style.top="5px";
            el_div.style.zIndex="9999";
            document.body.append(el_div);
            const re=/\/(\d+)$/;

            const el_all_button=document.createElement("button");
            el_all_button.innerText=`下载全部`;
            el_all_button.addEventListener('click',(event)=>{
                el_all_button.setAttribute('disabled','');
                el_all_button.style.backgroundColor="grey";
                el_all_button.style.color="white";
                const el_buttons=el_div.querySelectorAll('button');
                (async ()=>{
                    for(let i=0;i<r.length;i++){
                        const el_button=el_buttons[i+1];
                        el_button.click();
                    }
                })();

            });
            el_div.append(el_all_button);

            for(let i=0;i<r.length;i++){
                const a=r[i];
                const el_button=document.createElement("button");
                const text=`下载 ${i+1}`;
                el_button.innerText=text;
                el_button.addEventListener('click',(event)=>{
                    const url=a.href;
                    const m=url.match(re);
                    if(m){
                        el_button.setAttribute('disabled','');
                        el_button.style.backgroundColor="grey";
                        el_button.style.color="white";
                        (async ()=>{
                            const episodeid=m[1];
                            const episode_data=await fn_dowload_episode(episodeid,(progress)=>{
                                const phase=progress.phase;
                                const total=progress.total;
                                if(phase=="download_photo" || phase=="start"){
                                    const done=progress.done;
                                    el_button.innerText=`${text} (${done}/${total})`;
                                }else if(phase=='start_zip'){
                                     el_button.innerText=`${text} (${total}张图片 正在压缩)`;
                                }else if(phase=='end_zip'){
                                     el_button.innerText=`${text} (下载完成)`;
                                }else if(phase=='zipping'){
                                    const percent=progress.percent;
                                     el_button.innerText=`${text} (${total}张图片 正在压缩${percent.toFixed(2)}%)`;
                                }
                            });
                            const filename=episode_data.filename;
                            const zip_data=episode_data.zipdata;
                            const base64_url=URL.createObjectURL(zip_data);
                            GM_download({
                                url:base64_url,
                                name:filename,
                            });
                        })();
                    }

                });
                el_div.append(el_button);
            };
            return;
            //window.setTimeout(fn_hideleft,1000);
        };
        //fn_blockAD();
        //fn_hideleft();
        fn_checkepisode();
    }
    const fn_dowload_episode=async function(episodeid,progress_callback){
        return new Promise((resolve,reject)=>{
            const episode_url=`https://18comic.org/photo/${episodeid}`;
            const xhr=new XMLHttpRequest();
            xhr.addEventListener('load',(event)=>{
                const xhr=event.target;
                const content=xhr.responseText;
                if(content.indexOf('發生錯誤')>=0){
                    GM_log('發生錯誤');
                }else{
                    const re_arr=/var page_arr = (\[[^\]]+\])/;
                    const re_title=/<title>(.+)\|H漫內頁瀏覽 Comics - 禁漫天堂<\/title>/;
                    let title='';
                    const m_title=content.match(re_title);
                    if(m_title){
                        title=m_title[1];
                    }

                    const m_arr=content.match(re_arr);
                    if(m_arr){
                        const arr_text=m_arr[1];
                        const photo_array=eval(arr_text);
                        if(progress_callback){
                            progress_callback({
                                phase:'start',
                                total:photo_array.length,
                                done:0,
                            });
                        }
                        if(photo_array.length){
                            (async ()=>{
                                const zip = new JSZip();
                                for(let i=0;i<photo_array.length;i++){
                                    const photo=photo_array[i];
                                    const photo_url=`https://cdn-msp.18comic.org/media/photos/${episodeid}/${photo}`;
                                    const photo_data=await fn_download_photo(photo_url);
                                    if(progress_callback){
                                        progress_callback({
                                            phase:'download_photo',
                                            total:photo_array.length,
                                            done:i+1,
                                        });
                                    }
                                    zip.file(photo,photo_data,{binary:true});
                                }
                                if(progress_callback){
                                    progress_callback({
                                        phase:'start_zip',
                                        total:photo_array.length,
                                    });
                                }
                                await zip.generateAsync({type:"blob"},(metadata)=>{
                                    if(progress_callback){
                                        progress_callback({
                                            phase:'zipping',
                                            total:photo_array.length,
                                            percent:metadata.percent,
                                        });
                                    }
                                }).then(function(content) {
                                    if(progress_callback){
                                        progress_callback({
                                            phase:'end_zip',
                                            total:photo_array.length,
                                        });
                                    }
                                    resolve({filename:`${title}.zip`,zipdata:content});
                                });

                            })();
                        }
                    }else{
                        GM_log('没发现图片数组');
                        reject('没发现图片数组');
                    }
                }
            });
            xhr.addEventListener('error',(event)=>{
                const xhr=event.target;
                GM_log('發生錯誤');
                reject('發生錯誤');
            });
            xhr.open('GET',episode_url);
            xhr.send();
        });
    };

    const fn_download_photo=function(photo_url){
        return new Promise((resolve,reject)=>{
            const re_photo_filename=/\/([^\/]+)$/;
            const m_photo_filename=photo_url.match(re_photo_filename);
            let photo_filename='noname.jpg';
            if(m_photo_filename){
                photo_filename=m_photo_filename[1];
            }

            GM_xmlhttpRequest({
                url:photo_url,
                method:'GET',
                responseType:'blob',
                onload:(event)=>{
                    const phpto_data=event.response;
                    fn_trans_photo(photo_url,phpto_data).then((transed_photo_data)=>{
                        resolve(transed_photo_data);
                    });
                },
                onerror:(event)=>{
                    reject(event);
                }
            });
        });
    };

    const fn_trans_photo=function(photo_url,photo_data){
        return new Promise((resolve,reject)=>{
            const re=/\/(\d+)\/(\d+)\./;
            const m=photo_url.match(re);
            if(m){
                const comicid=m[1];
                const photonum=m[2];
                let splitnum=1;
                if(parseInt(comicid)>=220980){
                    splitnum=get_num(comicid,photonum);
                }
                if(splitnum>1){
                    const img=new Image();
                    img.onload=(event)=>{
                        const canvas=document.createElement("canvas");
                        const context=canvas.getContext("2d");
                        const naturalWidth=img.naturalWidth,naturalHeight=img.naturalHeight;
                        canvas.width=naturalWidth;
                        canvas.height=naturalHeight;
                        const remainder=parseInt(naturalHeight%splitnum);
                        const splitHeight=Math.floor(naturalHeight / splitnum);
                        for(let i=0;i<splitnum;i++){
                            const src_y=naturalHeight-splitHeight*(i+1)-remainder;
                            const desc_y=splitHeight*i;
                            context.drawImage(img,0,src_y,naturalWidth,splitHeight,0,desc_y,naturalWidth,splitHeight);
                        }
                        canvas.toBlob((b)=>{
                            resolve(b);
                        }, 'image/jpeg',0.90);
                    };
                    img.src=URL.createObjectURL(photo_data);

                }else{
                    resolve(photo_data);
                }
            }else{
                resolve(photo_data);
            }

        });

    }

    const href=document.location.href;
    const match=[
        {
            "re":/^https?:\/\/18comic.org\//,
            "fn":fn_18comic,
        },
    ];

    for(let i=0;i<match.length;i++){
        const m=match[i];
        if(m.re.test(href)){
            m.fn();
            break;
        }
    }
})();
