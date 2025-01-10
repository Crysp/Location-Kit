import { Map } from './Map';

export const App = () => {
  return (
    <>
      <Map />
      <div className="debug">
        {/*<button onClick="locationKit.setStyle(false)">Light Theme</button>*/}
        {/*<button onClick="locationKit.setStyle(true)">Dark Theme</button>*/}
      </div>
    </>
  );
};
