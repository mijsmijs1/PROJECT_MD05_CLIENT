import { Suspense, lazy } from "react"
import Fallback from "./components/Fallback"
import Loading from "./components/Loading"

const LazyLoad = (importFn: any, assess: boolean = true, fallback: string | null = null) => {
    if (!assess) {
        return () => {
            return <Fallback fallback={fallback} />;
        }
    }
    const LazyComponent = lazy(importFn)
    return () => {
        return (
            <Suspense fallback={<Loading />}>
                <LazyComponent />
            </Suspense>
        );
    }
}
export default LazyLoad;