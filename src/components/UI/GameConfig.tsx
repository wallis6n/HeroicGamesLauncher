import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createNewWindow, formatStoreUrl, Game, getGameInfo, legendary } from "../../helper";
import NavBar from './NavBar';
import "../../App.css";

interface Card {
  location: any;
}

export default function GameConfig({ location }: Card) {
  const [gameInfo, setGameInfo] = useState({} as any);
  const [playing, setPlaying] = useState(false);
  const [installing, setInstalling] = useState(false);

  const { appName, userName } = location.state || {};

  
  React.useEffect(() => {
    const updateConfig = async () => {
      const newInfo = await getGameInfo(appName);
      setGameInfo(newInfo);
    };
    updateConfig();
  }, [location, appName]);
  
  
  if (!appName) {
    return <div><Link to={"/"}>Back to Library</Link></div>;
  }

  if (gameInfo) {
    const {
      title,
      art_square,
      install_path,
      install_size,
      isInstalled,
      executable,
      version,
      developer
    }: Game = gameInfo;
    const sizeInMB = Math.floor(install_size / 1024 / 1024);
    const protonDBurl = `https://www.protondb.com/search?q=${title}`

    return (
      <>
        <NavBar handleOnClick={() => null} user={userName} renderBackButton />
        <div className="gameConfig">
          <img alt="cover-art" src={art_square} className="gameImg" />
          <div className="gameInfo">
            <div className="title">
              {title}
            </div>
            <div className="infoWrapper">
              <div className="developer">{developer}</div>
              <div>appName: {appName}</div>
              {isInstalled && (
                <>
                  <div>Executable: {executable}</div>
                  <div>Location: {install_path}</div>
                  <div>Size: {sizeInMB}MB</div>
                  <div>Version: {version}</div>
                  <br />
                </>
              )}
            </div>
            <div className="buttonsWrapper">
              {isInstalled && (
                <>
                <div
                onClick={async () => {
                  setPlaying(true);
                  await legendary(`launch ${appName}`);
                  setPlaying(false);
                }}
                className="button is-primary"
                >
                  {playing ? "Playing" : "Play"}
                </div>
              </>
              )}
              <div
                onClick={async () => {
                  setInstalling(true)
                  await legendary(
                    isInstalled
                    ? `uninstall ${appName}`
                    : `install ${appName}`
                    )
                  setInstalling(false)
                  }
                }
                className={`button ${isInstalled ? 'uninstall is-danger' : 'is-success install'}`}
              >
                {`${isInstalled ? "Uninstall" : installing ? "Installing" : "Install"}`}
              </div>
              <div onClick={() => createNewWindow(formatStoreUrl(title))} className="button is-empty">Epic Store</div>
              <div onClick={() => createNewWindow(protonDBurl)} className="button is-empty">ProtonDB</div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return null;
}
