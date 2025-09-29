import React from "react";
import Test from './test';
import Main from './main';

type View = "MAIN" | "TEST";

function Offline() {

    const [view, setView] = React.useState<View>('MAIN');

    if (view === 'TEST')
    {
        return <Test/>;
    }
    return <Main/>;

}

// function Offline() {
//     // const [view, setView] = useState<View>('main');
//
//     return <div>ddddd</div>;
//
//     // if (view === 'test') {
//     //     return <Test onBack={() => setView('main')} />;
//     // }
//     // return <Main onStartTest={() => setView('test')} />;
// }



export default Offline;