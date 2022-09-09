import React, { useContext, useState } from 'react'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Layout } from '../../components'
import Dialog from '../../components/Dialog/Dialog'
import Keyboard from '../../components/UI-COMP/keyboard'
import Modal from '../../components/UI-COMP/modal'
import DataContext from '../../context/DataContext'
import { CryptoCoins } from '../../data'
import { formatCurrency } from '../../utils/creditCard'


const bgImageStyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
};



function CryptoCurrencies() {

    const [isPaymentActive, setIsPaymentActive] = useState(false)
    const [coinData, setCoinData] = useState({})
    const togglePaymentActive = () => setIsPaymentActive(!isPaymentActive)

    function buyCrypto(e: any) {
        const dataset = e.target.dataset;
        if (Object.entries(dataset).length === 0) return;
        setCoinData(dataset)
        togglePaymentActive()
    }

    return (
        <Layout includeNav={false}>
            <div className="w-full h-screen overflow-hidden relative bg-dark-100">
                <div className="w-full flex items-center justify-start px-4 py-3 ">
                    <Link to="/dashboard" className="w-auto">
                        <button className="px-3 py-2 rounded-md bg-dark-200 ">
                            <FaLongArrowAltLeft className="text-[20px] text-white-200 " />
                        </button>
                    </Link>
                    <p className="text-white-100 font-extrabold ml-3">CryptoCurrency Payment</p>
                </div>
                <p className="text-white-200 px-4">Purchase a crypto currency coin with ease.</p>
                <p className="text-white-300 font-extrabold px-4">All</p>
                <br />
                <div className="w-full h-screen overflow-y-scroll noScrollBar px-4 py-3 flex flex-wrap items-center justify-start gap-5 ">
                    {
                        CryptoCoins.map((data) => (
                            <div className="w-full rounded-[10px] p-5 bg-dark-200 flex items-start justify-start relative">
                                <div
                                    id="img"
                                    className="w-[40px] h-[40px] opacity-[.8] "
                                    style={{
                                        ...bgImageStyle,
                                        backgroundImage: `url("${data.img}")`,
                                    }}
                                ></div>
                                <div className="w-auto flex flex-col items-start justi9fy-start ml-2 ">
                                    <p className="text-white-100 font-extrabold">{data.name}</p>
                                    <p className="text-white-200 text-[12px] ">{data.id}</p>
                                </div>
                                <button className=" absolute right-5 top-4 bg-dark-100 px-5 py-2 rounded-md text-white-300 scale-[.80]" data-id={data.id} data-name={data.name} onClick={buyCrypto}>
                                    Buy
                                </button>
                            </div>
                        ))
                    }
                    <div className="w-full h-[120px] "></div>
                </div>
                <br />

                {isPaymentActive && <PaymentSection active={isPaymentActive} togglePayment={togglePaymentActive} coinData={coinData} />}
            </div>
        </Layout>
    )
}

export default CryptoCurrencies

function PaymentSection({ coinData, active, togglePayment }: any) {
    const { steps, setSteps, clearStep, clearPin } = useContext<any>(DataContext);
    const [kbactive, setKbActive] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState({
        amount: "",
        cryptoAddress: "",
        walletId: ""
    })

    const toggleStep = (step: number) =>
        setSteps((prev: any) => ({ ...prev, dialog: step }));

    const handleInput = (e: any)=>{
        const value = e.target.value;
        const name = e.target.name;
        setPaymentInfo((prev: any)=>({...prev, [name]: value}))
    }

    const clearPaymentInfo = ()=> setPaymentInfo({amount: "", cryptoAddress: "", walletId: ""})

    const closeKeyboard = () => {
        setKbActive(false);
        clearStep("dialog", 1);
        clearPin();
        togglePayment();
        clearPaymentInfo()
    };

    const closePaymentSection = () => {
        togglePayment();
        clearStep("dialog", 1);
        clearPaymentInfo()
    };

    async function handlePayment() {
        // handle top up functionality
    }

    return (
        <Modal isActive={true} clickHandler={closePaymentSection}>
            <Dialog height={370}>
                <div className="w-full flex flex-col items-center justify-center">
                    <p className="text-white-200">Crypto Purchase</p>
                </div>
                <br />
                <br />
                {
                    steps.dialog === 1 ?
                        <div className="w-full h-auto flex  text-center flex-col items-center justify-center px-6">
                            <p className="text-white-100 font-extrabold">{coinData.id} <span className="text-white-300"> :- </span> <span className="text-blue-300">{formatCurrency("USD", +paymentInfo.amount)}</span> </p>
                            <br />
                            <input type="text" value={paymentInfo.cryptoAddress} name="cryptoAddress" onChange={handleInput} placeholder='wallet_address' className="w-full px-4 py-3 text-white-200 rounded-[30px] bg-dark-100 " />
                            <br />
                            <input type="number" name="amount" onChange={handleInput} value={paymentInfo.amount} placeholder='amount' className="w-full px-4 py-3 text-white-200 rounded-[30px] bg-dark-100 " />
                            <br />
                            <button
                                className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] "
                                onClick={() => toggleStep(2)}
                            >
                                Continue
                            </button>
                            <br />
                        </div>
                        :
                        steps.dialog === 2 ?
                            <div className="w-full h-auto flex flex-col items-start justify-start px-6">
                                <p className="text-white-200">
                                    Balance:{" "}
                                    <span className="font-extrabold text-blue-300">$300</span>{" "}
                                </p>
                                <br />
                                <select
                                    name=""
                                    id=""
                                    className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]"
                                >
                                    <option value="">Select Account</option>
                                </select>
                                <br />
                                <button
                                    className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] "
                                    onClick={() => toggleStep(3)}
                                >
                                    Continue
                                </button>
                                <br />
                            </div>
                            :
                            steps.dialog === 3 ?
                                <Keyboard
                                    active={kbactive}
                                    toggleKeyboard={closeKeyboard}
                                    handler={handlePayment}
                                    title="Booking Payment"
                                    subTitle={formatCurrency("USD", +paymentInfo.amount)}
                                />
                                :
                                ""
                }
            </Dialog>
        </Modal>
    );
}
