
import { useTranslation } from 'react-i18next'
import './navbar.scss'
import { convertToVND } from '@mieuteacher/meomeojs';
import { Modal, message } from 'antd';
import { Dropdown } from 'react-bootstrap';
import MultiLanguage from '../multiLanguage/MultiLanguage';
import { animated, useSpring } from 'react-spring';
import { useEffect, useState } from 'react';
import { authenAction } from '@/stores/slices/authen.slice';
import { logout } from '@/services/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { socketChat } from '@/sokets/chat.socket';
import ChatBox from '../chatbox/ChatBox';
import TopUpForm from '../topUp/TopUpForm';
import { api } from '@/services/apis';
import { receiptAction } from '@/stores/slices/receipt.slice';
export default function Navbar({ setModalVisible }: { setModalVisible: any }) {
  const { t } = useTranslation();
  const authenStore = useSelector((store: Store) => store.authenStore)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayChat, setDisplayChat] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const chatStore = useSelector((store: Store) => store.chatStore)
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  const receiptStore = useSelector((store: Store) => store.receiptStore)
  const [category, setCategory] = useState(null)
  const [showTopUpForm, setShowTopUpForm] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchContent, setSearchContent] = useState([])
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [searchCategory, setSearchCategory] = useState<any>({
    name: "Toàn bộ",
    createAt: String(Date.now()),
    updateAt: String(Date.now()),
    codeName: "all",
    avatar: "https://cdn-icons-png.flaticon.com/512/5110/5110770.png"
  })

  useEffect(() => {

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrollingDown(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.receipt.findManyByUserId(Number(authenStore.data?.id));

        if (res.status === 200) {
          let cart = null;
          let receipt = [];
          for (let i in res.data.data) {
            if (res.data.data[i].status == "shopping") {
              cart = res.data.data[i]
            } else {
              receipt.push(res.data.data[i])
            }
          }
          dispatch(receiptAction.setCart(cart))
          dispatch(receiptAction.setReceipt(receipt))
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [authenStore.data])

  const openModal = () => {
    setModalVisible(true);
  };
  const propstyle = useSpring({
    paddingTop: isScrollingDown ? "20px" : "40px",
    paddingBottom: isScrollingDown ? "20px" : "40px",
    borderRadius: isScrollingDown ? "10px" : "10px",
  })
  useEffect(() => {
    if (!displayChat) {
      socketChat.disconnectChat()
      return
    }
  }, [displayChat])
  const handleMouseEnter = (cate) => {
    setCategory(cate)
  }
  const handleMouseLeave = () => {
    setCategory(null)
  }
  async function handleShowSearch(searchKey: string) {


    if (searchKey.length > 0) {
      setKeyword(searchKey);
      setShowSearch(true);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setSearchContent([]);
      }
      setTypingTimeout(setTimeout(async () => {
        let result = await api.product.getProductSearch(searchKey, searchCategory.codeName)
        if (result.status == 200) {
          console.log('result', result);

          if (Object.keys(result.data.data).length != 0) {
            setSearchContent(Object.values(result.data.data))
          }
        }
      }, 1000))
    } else if (searchKey == "") {
      setShowSearch(false)
    }
  }
  return (
    <div className='nav_box'>
      <div className="nav_top">
        <div className="left">
          <a>{t('navbar.categoryMall')}</a>
          <a>{t('navbar.GetApp')}</a>
          <a>{t('navbar.connect')} </a><i className="fa-brands fa-facebook"></i><i className="fa-brands fa-youtube"></i>
        </div>
        <div className="right">
          <div className="wallet_box">
            <span style={{ color: "red", fontWeight: 700, fontSize: 18 }}>{convertToVND(authenStore.data?.wallet ? authenStore.data?.wallet : 0)} <ion-icon name="cash-outline"></ion-icon></span>
            <button
              onClick={() => {
                if (!authenStore.data) {
                  Modal.warning({
                    title: "Warning",
                    content: "Vui lòng đăng nhập!",
                    onOk: () => {
                      openModal()
                    }
                  })
                  return
                }
                setShowTopUpForm(!showTopUpForm)
              }}
              className="top_up"><i className="fa-solid fa-money-bill-transfer"></i>
              {t('navbar.topup')}
            </button>
          </div>
          <div>
            <i className="fa-solid fa-comments-dollar"></i>
            <p>{t('navbar.help')}</p>
          </div>
          <div>
            <i className="fa-solid fa-language"></i>
            <MultiLanguage />
          </div>
        </div>
      </div>

      <div className="navbar_container">
        <animated.div className="navbar_container_child" style={propstyle}>
          <div className="logo">
            <img src="../../../img/logo_chotroi.png" alt="" onClick={() => {
              window.location.href = "/"
            }} />
            <div className="category">
              <ion-icon name="apps-outline"></ion-icon>
              <p >{t('navbar.category')}</p>
              <ion-icon name="chevron-down-outline"></ion-icon>
              {
                categoryStore.category && (
                  <div className='sup_menu'
                    onMouseLeave={handleMouseLeave}>

                    {
                      categoryStore.category.map(supItem => {


                        return (
                          <div onClick={() => {
                            navigate(`/search?category=${supItem.codeName}&&page=1`)
                          }}
                            key={Date.now() * Math.random()}
                            className='sup_menu_item'
                            onMouseEnter={() => { handleMouseEnter(supItem) }}

                          >
                            <img src={String(supItem.avatar)}></img>
                            <span>{supItem.name}</span>

                          </div>
                        )
                      })}
                    {category && <div className="child_box">
                      {
                        category && category.branches?.map(branch => {
                          return (
                            <div onClick={() => {
                              navigate(`/search?category=${category.codeName}&&branch=${branch.codeName}&&page=1`)
                            }}
                              key={Date.now() * Math.random()}
                              className='sup_menu_item_child'>
                              <span>{branch.name}</span>
                            </div>
                          )
                        })
                      }
                    </div>}
                  </div>
                )
              }

            </div>
          </div>

          <div className="search">
            <div className="category_search">
              <p>{searchCategory.name}</p>
              <ion-icon name="chevron-down-outline"></ion-icon>
              {
                categoryStore.category && (
                  <div className='sup_menu'
                    onMouseLeave={handleMouseLeave}>

                    {
                      [
                        ...categoryStore.category,
                        {
                          name: "Toàn bộ",
                          createAt: String(Date.now()),
                          updateAt: String(Date.now()),
                          codeName: "all",
                          avatar: "https://cdn-icons-png.flaticon.com/512/5110/5110770.png"
                        }
                      ]
                        .map(supItem => {


                          return (
                            <div onClick={() => {
                              setSearchCategory(supItem)
                            }}
                              key={Date.now() * Math.random()}
                              className='sup_menu_item'
                            >
                              <img src={String(supItem.avatar)}></img>
                              <span>{supItem.name}</span>

                            </div>
                          )
                        })}
                  </div>
                )
              }

            </div>
            <i className="fa-solid fa-magnifying-glass" onClick={() => {
              if (keyword) {
                window.location.href = `/search?category=${searchCategory.codeName}&&keyword=${keyword}&&page=1`
              }
            }}></i>
            <input type="text" placeholder={t('navbar.placeHolderSearch')} onChange={(e) => handleShowSearch(e.target.value)} />
            {showSearch ?
              <div className="search_content_container">
                <p className="result-search-title">Kết quả tìm kiếm tương ứng </p>
                <div className="result-search-content">
                  <div className="result-search-item">
                    {
                      searchContent.length > 0 ? searchContent?.map(item => {
                        return (<span
                          onClick={() => {
                            window.location.href = `product-info?productId=${item.id}`
                          }}
                        ><i className="fa-solid fa-magnifying-glass"></i> {item.name}</span>)
                      }) : (<span>{`Không tìm thấy kết quả nào! `} <i className="fa-regular fa-face-sad-tear"></i></span>)

                    }

                  </div>
                </div>
              </div> : <></>}
          </div>

          <div className="login_logo">

            {
              !authenStore.data ?

                <button className="cta"
                  onClick={() =>
                    openModal()
                  }
                >
                  <span className="hover-underline-animation"> {t('navbar.login')} </span>
                  <svg
                    id="arrow-horizontal"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="10"
                    viewBox="0 0 46 16"
                  >
                    <path
                      id="Path_10"
                      data-name="Path 10"
                      d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                      transform="translate(30)"
                    ></path>
                  </svg>
                </button>
                : <>
                  <div className='cart_box'
                  >
                    <i onClick={() => {
                      navigate("/cart")
                    }} className="fa-brands fa-shopify"></i>
                    <span className="sum">
                      ({
                        receiptStore.cart?.detail?.length || 0
                      })
                    </span>
                    {
                      true && (
                        <div className='sup_menu'
                          onMouseLeave={handleMouseLeave}>

                          {
                            receiptStore.cart ? receiptStore.cart?.detail?.map(supItem => {


                              return (
                                <div
                                  key={Date.now() * Math.random()}
                                  className='sup_menu_item'
                                  onMouseEnter={() => { handleMouseEnter(supItem) }}

                                >
                                  <img src={`${import.meta.env.VITE_SV_HOST}/${supItem.products.avatar}`}></img>
                                  <span
                                    onClick={() => {
                                      window.location.href = `/product-info?productId=${supItem.productId}`
                                    }}
                                  >{supItem.products.name}</span>
                                  <i
                                    onClick={() => {
                                      Modal.confirm({
                                        title: "Confirm",
                                        content: "Bạn có chắc muốn xóa tin này?",
                                        onOk: async () => {
                                          await api.receipt.delete(supItem.id);
                                          dispatch(receiptAction.deleteItem(supItem.id));
                                        }
                                      })
                                    }}

                                    className="fa-solid fa-calendar-xmark"></i>
                                </div>
                              )
                            }) : <img style={{ width: "100%", height: "150px" }} src="https://elements-cover-images-0.imgix.net/05a48f9e-c24f-40f2-bbf6-6dde8c2f77d0?auto=compress%2Cformat&w=900&fit=max&s=98115fe5c0ab12c459343cc3c758d5e5"></img>
                          }
                        </div>
                      )
                    }
                  </div>
                  <div className="user_box">
                    <Dropdown>
                      <Dropdown.Toggle variant='light' id="dropdown-basic">
                        <div className='user_box'>
                          <span>{t('navbar.hi')} {isNaN(Number(authenStore.data?.userName)) ? authenStore.data?.userName : authenStore.data?.email?.split('@')[0]}!</span>
                          <img src={authenStore.data?.avatar.includes('img/') ? `${import.meta.env.VITE_SV_HOST}/${authenStore.data?.avatar}` : `${authenStore.data?.avatar}`} />


                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => {
                          window.location.href = "/wallet"
                        }}>{t('navbar.wallet')}</Dropdown.Item> */}
                        <Dropdown.Item onClick={() => {
                          window.location.href = `/user_info?userId=${authenStore.data?.id}`
                        }}>Thông tin</Dropdown.Item>
                        <Dropdown.Item onClick={() => {
                          Modal.confirm({
                            title: "Xác nhận",
                            content: "Bạn chắc chắn muốn đăng xuất!",
                            onOk: async () => {
                              await logout()
                              localStorage.removeItem("token")
                              dispatch(authenAction.setData(null))
                              window.location.href = "/"
                            }
                          })
                        }}>{t('navbar.logout')}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
            }
          </div>
          <button className="button_up" onClick={() => {
            if (authenStore.data) { navigate("/post") } else {
              message.warning('Bạn chưa đăng nhập!');
              openModal()
            };
          }}><i className="fa-solid fa-pen-to-square" ></i> {t('navbar.post')}</button>
          <button className="chat-button" onClick={async () => {

            if (!localStorage.getItem('token')) {
              message.warning("Hãy đăng nhập để sử dụng chức năng chat!")
              openModal();
              return
            }
            if (!authenStore.data) {
              message.warning("Lỗi hệ thống, vui lòng đăng nhập lại!")
              setTimeout(() => {
                window.location.href = "/"
              }, 1000)
            }
            setDisplayChat(!displayChat);
            let connect = await socketChat.connectChat();
            if (connect?.status) {
              console.log("ket nối thành công");

            } else {
              message.warning("Lỗi hệ thống chat!")
            }
          }}>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  />
                </svg>
              </div>
            </div>
            <span>Chat</span>
          </button>




        </animated.div>
        <div className="navbar_mobile_child"></div>
        <div className="navbar_mobile">
          <div className="logo_mobile">
            <img src="https://vanphongxanh.vn/wp-content/uploads/2022/03/logo-social.png" alt="" />
          </div>
          <div className="icon_bar">
            <i
              onClick={() => setShowNavbar(!showNavbar)}
              className="fa-solid fa-bars"></i>
          </div>
        </div>
        {
          showNavbar
            ? <div className="navbar_mobile_content">
              <p
                onClick={() => { navigate("/"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}
              >
                {t('sidebar.home')}</p>

              <p
                onClick={() => { navigate("/course/1"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}
              >
                {t('sidebar.courses')}</p>
              <p
                onClick={() => { navigate("/login"); setShowNavbar(!showNavbar); setShowNavbar(!showNavbar) }}
              >
                {t('navbar.login')}</p>
            </div> : <></>}
        {showTopUpForm && <TopUpForm setShowTopUpForm={setShowTopUpForm} />}
        {
          displayChat && (
            <>
              <ChatBox data={chatStore.data || []} user={authenStore.data} setDisplayChat={setDisplayChat} />
            </>
          )
        }
      </div>
    </div>
  )
}
