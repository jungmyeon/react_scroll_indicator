// scrollIndicator 라는 컴포넌트를 만들어서
// App.js에 붙이기
import { useEffect, useState } from 'react'
import './scroll-indicator.css'

// 다른 파일에서 사용할 수 있게
export default function ScrollIndicator({url})
{
  // useEffect에서 비동기로 fetch(get요청)
  // 서버에서 데이터를 받아옴 
  // 1. 서버의 주소 
  // 2. 데이터를 저장할 state
  // 3. fetch와 같은 오래걸리는 작업을 처리할 useEffect

  // 응답데이터를 받아서 저장할 state 
  // data 빈 배열 
  // 상태 : 서버데이터, 로딩체크, 에러, 스크롤위치 
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [errMsg, setErrMsg] = useState("");
  let [scrollPercentage, setScrollPercentage] = useState(0);

  // fetch (HTTP요청)은 화면에 영향이 가지 않도록 async 제작
  async function fetchData(url){
    try{
      // 서버에 요청을 하기 전에 로딩 상태로 만든다 
      setLoading(true);   // 로딩 상태 ON
      let res = await fetch(url);   // get 요청 
      // 처리가 완료될때까지 기다리기 위해 await
      // 응답으로 받은 문자열을 json으로 인식
      const res_json = await res.json();
    
      setData(res_json.products);
      // 데이터에 저장했으니까 로딩상태 해제
      setLoading(false);
    }catch(e){
      // 에러 발생시 (try코드를 수행하다가 에러가 발생하면 즉시 이곳으로)
      setErrMsg(e.message);
      console.log(e);
    }
  }

  // 사이드 기능 (화면 외)는 useEffect 
  // useEffect : 컴포넌트 생성시, 변경시, 해제시 코드 삽입 
  useEffect(()=>{
    // 처음에는 무조건 1번 실행 (생성시 mount)
    // fetch로 get 요청해서 데이터를 받아서 data에 넣자
    fetchData(url);
  },[url])    // url이 바뀔때마다 실행  (안적으면 모든 데이터에 대해 실행)

  // 스크롤 이벤트
  useEffect(()=>{
    window.addEventListener('scroll',changeScrollEvent)
  })

  function changeScrollEvent(){
    // 스크롤의 위치를 감지 ==> 현재 스크롤 위치
    let scrolled = document.documentElement.scrollTop;
    // 창이 작을수도 있으니까 현재 열려있는 창의 스크롤 범위를 계산 ==> 전체 스크롤 가능한 범위
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // (현재 / 전체) * 100 : 퍼센트
    setScrollPercentage((scrolled / height)*100);
  
  }

  console.log(data)

  if(loading)   // 로딩 중이면(true)
  {
    // 컴포넌트도 함수기 떄문에 return을 만나면 그 즉시 종료 (밑에 코드 실행 X)
    return(
      <div>데이터 로딩 중...</div>
    )
  }

  if(errMsg)    // 에러메세지에 무언가 있으면
  {
    return(
      <div>{errMsg}</div>
    )
  }

  return(
    <>
    <div className='top-nav-container'>
      <h1>Scroll Indicator</h1>
      {/* 스크롤 진행도 전체 범위 */}
      <div className='scroll-progress-tracking'>
        {/* 스크롤의 실제 위치를 퍼센트로 그려줄 박스 */}
        <div className='current-progress-bar' style={{width:`${scrollPercentage}%`}}></div>
      </div>
    </div>
    {/* 스크롤용 데이터 */}
      <div className='data-list'>
        {
          // data를 map을 통해 p 태그로 e.title출력
          // <p>{e.title}</p>
          // data가 비어있지 않고 길이가 0보다 클때, p태그 생성
          data && data.length > 0 ? 
          (data.map((e,idx)=>{
            return(
              <>
              <p key={idx}>{e.title}</p>
              </>
            )
          })) : (null)
        }
      </div>
    </>
  )
}