import React, { useContext, useEffect, useState } from "react";
import APIROUTES from "../../apiRoutes";
import { Button, Input } from "../../components/UI-COMP";
import { sleep } from "../../utils";
import Fetch from "../../utils/fetch";
import Notification from "../../utils/toast";
import { validateEmail, validatePin } from "../../utils/validate";
import countries from "../../data/countries.json";
import supportedCountries from "../../data/supported_countries.json";
import { Spinner } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";

const notif = new Notification(10000);

function Authentication() {
  const {isAuthenticated} = useContext<any>(DataContext)
  const [steps, setSteps] = useState(2);
  const [input, setInput] = useState<any>({
    username: "",
    fullname: "",
    country: "",
    currency: "",
    email: "",
    password: "",
    pin: "",
  });
  const [country, setCountry] = useState<any>([]);
  const [suppCurrencies, setSuppCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState<any>(false);

  const [selectedCountry, setSelectedCountry] = useState("");

  if(isAuthenticated){
    window.location.href = "/dashboard"
    return null
  }

  useEffect(() => {
    let store = [];
    for (const key in supportedCountries.supported_countries) {
      const elem: any = (supportedCountries.supported_countries as any)[key].name;
      const code = (supportedCountries.supported_countries as any)[key].country
      let formatedCountry = {
        name: elem,
        code,
      };
      store.push(formatedCountry);
    }
    setCountry(store.sort((a:any, b:any)=>{
      let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();
      if (fa < fb) return -1;
      if (fa > fb)return 1;
      return 0;
    }));
  }, []);

  useEffect(() => {
    const filteredCurrencies : any = supportedCountries.supported_countries.filter((data)=> data.country === selectedCountry)[0] || []
    const currencies = filteredCurrencies.length === 0 ? [] : filteredCurrencies.currencies
    setSuppCurrencies(currencies)
  }, [selectedCountry]);

  const toggleSteps = (step: number) => setSteps(step);

  const handleInput = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((prev: any) => ({ ...prev, [name]: value }));
    if(name === "country") setSelectedCountry(value)
  };

  async function handleAuthData(action: string) {
    const { email, password, username, pin, fullname, country, currency } = input;
    const url = action === "login" ? APIROUTES.login : APIROUTES.register;

    if (action === "login") {
      if (email === "") return notif.error("email is missing");
      if (!validateEmail(email)) return notif.error("email is invalid");
      if (password === "") return notif.error("password is missing");

      try {
        // login user
        setLoading(true);
        const { res, data } = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setLoading(false);

        if (!data.success) {
          // console.log(data);
          return notif.error(data.message);
        }

        notif.success(data.message);
        localStorage.setItem("payrill", JSON.stringify(data.data));
        localStorage.setItem("payrill-authtoken",JSON.stringify(data.data.accessToken || ""));
        await sleep(2);
        window.location.href = "/dashboard";
      } catch (e: any) {
        // console.log(e);
        notif.error(e.message);
        setLoading(false);
      }
    }

    if (action === "register") {
      if (fullname === "") return notif.error("full name is missing");
      if (username === "") return notif.error("username is missing");
      if (country === "") return notif.error("country is missing");
      if (currency === "") return notif.error("currency is missing");
      if (email === "") return notif.error("email is missing");
      if (pin === "") return notif.error("pin is missing");
      if (password === "") return notif.error("password is missing");
      if (!validateEmail(email)) return notif.error("email is invalid");
      if (!validatePin(pin)) return notif.error("pin is invalid");

      try {
        // register user
        setLoading(true);

        const { res, data } = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(input),
        });
        setLoading(false);

        if (!data.success) {
          // console.log(data);
          return notif.error(data.message);
        }

        notif.success(data.message);
        await sleep(1)
        toggleSteps(1)
      } catch (e: any) {
        // console.log(e);
        notif.error(e.message);
        setLoading(false);
      }
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4">
      {steps === 1 ? (
        <div className="w-full md:w-[45%] p-5">
          <p className="text-white-100 text-[20px] font-extrabold ">Log In</p>
          <Input placeHolder="email" onChange={handleInput} name="email" />
          <Input
            placeHolder="password"
            type="password"
            onChange={handleInput}
            name="password"
          />
          <br />
          <br />
          <button
            className="w-full flex flex-col items-center justify-center px-3 py-3 bg-blue-300 rounded-md mt-1 text-white-100 "
            onClick={async () => await handleAuthData("login")}
            disabled={loading}
          >
            {loading ? <Spinner color="#fff" /> : "Sign In"}
          </button>
          <br />
          <br />
          <span className="text-white-100">Dont have an account ? <span className="text-blue-300 font-extrabold cursor-pointer " onClick={()=>toggleSteps(2)}>Create One ?</span> </span>
        </div>
      ) : (
        <div className="w-full md:w-[45%] p-5">
          <p className="text-white-100 text-[20px] font-extrabold ">Register</p>
          <div className="w-full flex items-center justify-between gap-10 ">
            <Input
              placeHolder="Full Name"
              onChange={handleInput}
              name="fullname"
            />
            <Input
              placeHolder="Username"
              onChange={handleInput}
              name="username"
            />
          </div>
          <br />
          <div className="w-full flex items-center justify-between gap-10 ">
            {/* {console.log(country.sort((a: any, b:any)=> a.code - b.code))} */}
            <select
              name="country"
              id=""
              className="w-full px-4 py-3 rounded-md bg-dark-200 text-white-100"
              onChange={handleInput}
            >
              <option value="">Countries</option>
              {country.map((data: any) => (
                <option value={data.code} key={data.code}>
                  {data.name}
                </option>
              ))}
            </select>
            <select
              name="currency"
              id=""
              className={`w-full px-4 py-3 rounded-md bg-dark-200 text-white-100 ${selectedCountry === "" ? "opacity-[.5]" : "opacity-1"} `}
              onChange={handleInput}
              disabled={selectedCountry === "" ? true : false}
            >
              <option value="">Currencies</option>
              {
              suppCurrencies.length > 0 ?
                suppCurrencies.map((data: any) => (
                  <option value={data} key={data}>
                    {data}
                  </option>
                ))
                :
                <option value="">Not Supported</option>
              }
            </select>
          </div>
          <Input placeHolder="email" onChange={handleInput} name="email" />
          <div className="w-full flex items-center justify-between gap-10 ">
            <Input
              placeHolder="pin"
              type="number"
              onChange={handleInput}
              name="pin"
            />
            <Input
              placeHolder="password"
              type="password"
              onChange={handleInput}
              name="password"
            />
          </div>
          <br />
          <button
            className="w-full flex flex-col items-center justify-center px-3 py-3 bg-blue-300 rounded-md mt-1 text-white-100 "
            onClick={async () => await handleAuthData("register")}
            disabled={loading}
          >
            {loading ? <Spinner color="#fff" /> : "Register"}
          </button>
          <br />
          <br />
          <span className="text-white-100">Have an account ? <span className="text-blue-300 font-extrabold cursor-pointer " onClick={()=>toggleSteps(1)}>Login ?</span> </span>
        </div>
      )}
    </div>
  );
}

export default Authentication;

function Login({ handleInput, handleAuthData }: any) {
  return (
    <div className="w-full p-5">
      <Input placeHolder="email" onChange={handleInput} name="email" />
      <Input placeHolder="password" onChange={handleInput} name="password" />
      <br />
      <br />
      <Button type="priamry" text="Log In" onClick={handleAuthData} />
    </div>
  );
}

function Register({ handleInput }: any) {
  return (
    <div className="w-full p-5">
      <Input placeHolder="Full Name" onChange={handleInput} name="username" />
      <Input placeHolder="email" onChange={handleInput} name="email" />
      <Input placeHolder="password" onChange={handleInput} name="password" />
      <br />
      <br />
      <Button type="priamry" text="Register Account" />
    </div>
  );
}
