import React, {useEffect, useState} from 'react';
import {Subject} from "rxjs";
import {interval} from "rxjs";
import {takeUntil} from "rxjs/operators";

function App() {

    const [time, setTime] = useState<number>(0)
    const [start, setStart] = useState<boolean>(false)
    const [wait, setWait] = useState<number>(0)

    const startStopHandler = () => {
        if (start) {
            setTime(0)
            setStart(false)
        } else {
            setStart(true)
        }
    }

    const waitHandler = () => {
        if (wait === 0) {
            setWait(1)
        }
        if (wait === 1) {
            setWait(0)
            setStart(false)
        }
    }

    const resetHandler = () => {
        setTime(0)
    }

    /*    useEffect(() => {
            let interval: number = 0
            if (start) {
                interval = setInterval((prevTime: number) => {
                    setTime(prevTime => prevTime + 10)
                }, 10)
            } else {
                clearInterval(interval)
            }
            return () => clearInterval(interval)
        }, [start])

        useEffect(() => {
            let interval: number = 0
            if (wait === 1) {
                interval = setInterval((p: number) => {
                    setWait(0)
                }, 300)
            } else {
                clearInterval(interval)
            }
            return () => clearInterval(interval)
        }, [wait])*/

    useEffect(() => {
        const unsub$ = new Subject()
        interval(1000)
            .pipe(takeUntil(unsub$))
            .subscribe(() => {
                if (start) {
                    setTime(val => val + 1000)
                }
            })
        return () => {
            unsub$.next(time)
            unsub$.complete()

        }
    }, [start])

    useEffect(() => {
        const unsub$ = new Subject()
        interval(300)
            .pipe(takeUntil(unsub$))
            .subscribe(() => {
                if (wait) {
                    setWait(0)
                }
            })
        return () => {
            unsub$.next(0)
            unsub$.complete()

        }
    }, [wait])

    return (
        <div>
            <div>
                <span>{('0' + Math.floor((time / 3600000) % 60)).slice(-2)} : </span>
                <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)} : </span>
                <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
            </div>
            <div>
                <button onClick={startStopHandler}>Start / Stop</button>
                <button onClick={waitHandler}>Wait</button>
                <button onClick={resetHandler}>Reset</button>
            </div>
        </div>
    );
}

export default App;
