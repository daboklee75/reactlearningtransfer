import { useEffect, useState } from 'react';
import Alert from './Alert';
import Offline from './components/offline/index';

// === 하드코딩된 초기값(나중에 교체 예정) ==========================
const HARDCODED_STORAGE = { lxp: true };
const HARDCODED_TRANSFER_URL = 'http://127.0.0.1:9000';
const HARDCODED_TRANSFER_TOKEN = 'TEST_TOKEN';

async function mockConnect(url?: string, token?: string) {
    if (!url || !token) return false;
    await new Promise((r) => setTimeout(r, 300)); // 연결 대기
    return true; // 연결 성공 가정
}

async function mockFetchDisplays() {
    await new Promise((r) => setTimeout(r, 200)); // 데이터 대기
    return { displays: { main: {} } }; // 최소 1개 표시
}

function Loading() {
    return <div>Loading...</div>;
}

function Header() {
    return <div>HEADER {HARDCODED_STORAGE.lxp ? '(LXP)' : ''}</div>;
}
function Footer() {
    return <div>FOOTER</div>;
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
    // 디자인 제외: 헤더/푸터만 단순히 노출 (필요 없으면 제거 가능)
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

function Index() {

    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [hasDisplays, setHasDisplays] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    console.log("index, isloading:", isLoading);
    console.log("index, error:", error);



    useEffect(() => {
        let alive = true;

        // === 3초 뒤 강제 에러 발생 (비동기 테스트용) ===
        // const timer = setTimeout(() => {
        //     if (alive) {
        //         console.log("테스트: 3초 후 강제 에러 발생!");
        //         setError(new Error("테스트용 에러"));
        //         setIsLoading(false);
        //     }
        // }, 3000);

        (async () => {
            try {
                // 1) 연결 시도
                const ok = await mockConnect(HARDCODED_TRANSFER_URL, HARDCODED_TRANSFER_TOKEN);
                if (!alive) return;

                setIsConnected(ok);

                // 연결 실패 → 잠시 후 경고
                if (!ok) {
                    setIsLoading(false);
                    // setTimeout(() => alive && setShowConnAlert(true), 1500);
                    return;
                }

                // 2) 디스플레이 데이터 조회
                const data = await mockFetchDisplays();
                if (!alive) return;

                const has = !!data?.displays && Object.keys(data.displays).length > 0;
                setHasDisplays(has);

                // 디스플레이 없으면 경고
                if (!has) {
                    setIsLoading(false);
                    // setTimeout(() => alive && setShowConnAlert(true), 1500);
                    return;
                }

                // 성공
                setIsLoading(false);
            } catch (e) {
                if (!alive) return;
                setError(e as Error);
                setIsLoading(false);
            }
        })();

        return () => {
            // clean Up
            alive = false;
            // clearTimeout(timer); // 타이머 정리
        };
    }, []);


    // 로딩
    if (isLoading) {
        return (
            <LayoutWrapper>
                <Loading/>
            </LayoutWrapper>
        );
    }

    // 오류
    if (error) {
        return (
            <LayoutWrapper>
                <Alert
                    message="오류가 발생했습니다."
                    onCancel={() => window.close?.()}
                />
            </LayoutWrapper>
        );
    }

    // 연결 안 됨 또는 디스플레이 없음
    if (!isConnected || !hasDisplays) {
        return (
            <LayoutWrapper>
                <Alert
                    message="장비 연결에 실패했거나 디스플레이가 없습니다."
                    onConfirm={() => alert('환경창 열기')}
                    onCancel={() => window.close?.()}
                />
            </LayoutWrapper>
        );
    }

    // 정상 출력 (LXP/Offline 분기는 나중에 추가)
    return (
        <LayoutWrapper>
            <div>연결 완료! 표시 가능한 디스플레이가 있습니다. (최소 화면)</div>
            <Offline />
        </LayoutWrapper>
    );
}


export default Index;