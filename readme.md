# PayRill

Making payment infrastructure flexible.

### [Payrill Extension](https://github.com/Benrobo/payrill-ext)

### [Payrill Store](https://github.com/Benrobo/payrill-store)



![payrill](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/221/915/datas/gallery.jpg)

![payrill](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/221/914/datas/gallery.jpg)

![payrill](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/002/221/920/datas/gallery.jpg)


## Why PayRill?

Significant number of shoppers are likely to exit physical stores before making a purchase if few number of staff members manage very long checkout queues; especially during periods of high transaction volume.

- [x] For retailers and shoppers worldwide
    Hopefully, our solution would significantly improve shopping experiences for shoppers and increase profit margin for retailers.

    We are inspired by how Amazon speeds up checkout processes in retail stores. We want to create a technology to speed up the checkout process in developing regions yet to benefit from similar solutions.

    Also, we noticed inflation rate has been skyrocketing exponentially in Africa.

    Local Currency in Nigeria is depreciating, and as a result foreign currencies are scarce. Some African students studying in developed countries are stranded because their parents or sponsors can't access foreign currencies, and also foreign exchange is high in some countries.

    Some major fintech players in Africa suspended issuing of virtual cards due to updates from their respective "partner(s)".

    The Super App "Hackathon" by Rapyd is a clarion call to provide solutions to people that need them urgently and we are privileged to respond to the call.

## What it does
PayRill is a multipurpose web application that enables the following:-

- [x]  Fast Checkout
    - PayRill facilitates the process of checking out in physical stores.
- [x] Use of E-cart
    - PayRill with a new and improved feature called E-cart that enhances and automates the purchasing of goods in less time by enabling customers Create, Manage and Transfer shopping carts. It leverages QR Code technology to authenticate and approve e-cart items.
- [x]  Use of Virtual Cards
    - How to create multi-currency virtual cards for sending and receiving cross boarder payments Block and Unblock Virtual Cards to prevent unwanted chargebacks.

## How we built it
We built the client side of the web app with React.js. We built the server side of the web app with NodeJS and developed the database with MySQL. We developed a chrome extension to enable transfers of shopping lists between a browser extension and our app such that persons can place orders and transfer the orders to enable their friends or families to checkout.

## How it works
As said earlier, PayRill is basically a `multi-purpose` fintech application which is meant to solve our daily fintech problems from making sure payments are done much easier and faster and also improves and enhances `shopping` both virtually and physically, also reduce customers queues while checking out.

PayRill works in the below steps :-

- Scan QR codes on physical physical items and add shopping information to ecart.

- Receive confirmation QR code.

- Show the QR code to merchant. Merchants scans the QR code and approve.

> To ensure the customer is not leaving the store with more items than they purchased, the seller can then quickly use a scale or weigh balance to cross check and confirm the total weight of the physical cart and total items purchased with the total weight of the purchased items electronically represented on the digital receipts.

Apart from the above steps mention above, PayRill can still be use as a regular fintech application from transfering funds between users within the app leveraging `Rapyd API` in the process, Deposit funds within a wallet, Withdraw funds, Purchase crypto and Hotel Booking. 

All this mentioned  above wont be possible without the use of `Rapyd Wallet API`, `Rapyd Disbursment`.


# Setting Up PayRill Locally.

As you may have seen, PayRill consist of a client side application and a server side api. The following list how each section can be setup.

## Client ( Typescript x React )

> Make sure Nodejs v16.x.x is installed on your pc.

### Step 1
Clone the github repo

```js
    git clone https://github.com/Benrobo/payrill.git
```

### Step 2
Install all project dependencies by running 

```js
    npm install
    // or
    yarn add
```

### Step 3
Star local development server
```
    npm run dev
```

A local server should be running @ `http://127.0.0.1:5173/`

## Server
> Visit [Payrill API](https://github.com/Benrobo/payrill-api.git)
