"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

const Home = () => {
  const [account, setAccount] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Veuillez installer MetaMask pour interagir avec l'application.");
      return;
    }

    try {
      setLoading(true);

      // Initialiser MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Récupérer l'adresse de l'utilisateur
      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      console.log("a");


      // Initialiser Push Protocol
      const userAlice = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING, // Utilisation du testnet (STAGING)
      });
      console.log("b");

      // Récupérer les notifications
      const channelAddress = "0x2D4Ec5dd34bCaff6c1998575763E12597092A044";
      const allNotifications = await userAlice.channel.notifications(channelAddress);
      console.log(allNotifications)
      setNotifications(allNotifications.notifications);
    } catch (error) {
      console.error("Erreur lors de la connexion à MetaMask ou PushAPI", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectMetaMask();
    }
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Application Push Protocol avec Next.js</h1>
      <p>Compte connecté : {account ? account : "Aucun compte connecté"}</p>

      <button onClick={connectMetaMask} style={{ marginBottom: "20px", padding: "10px 20px" }}>
        Connecter MetaMask
      </button>

      <h2>Notifications :</h2>
      {loading ? (
        <p>Chargement des notifications...</p>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <strong>{notification.message.notification.title}</strong>: {notification.message.notification.body}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune notification disponible.</p>
      )}
    </div>
  );
};

export default Home;
