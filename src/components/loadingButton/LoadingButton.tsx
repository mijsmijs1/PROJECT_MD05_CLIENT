import Icon from '@ant-design/icons'
import './loadingButton.scss'

export default function LoadingButton() {
    const LoginSvgIcon = () => (
        <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
            <g style={{ transform: "scale(4)" }}>
                <path d="M201,211.24c-36,45.11-112.16,41.85-148.08-6-34.83-46.37-24.31-111.51,23.28-144,48.48-33.14,115.93-18.83,147.17,31.17a103.08,103.08,0,0,1,16.21,52c.3,9.08-3.14,15.79-12.55,16.11s-13.74-6-13.53-15.13c1-45.3-37.47-83.93-85.09-82.8s-84.31,41-83.16,89.42c1.11,46.51,41.48,85.6,88.38,85.6C156.68,237.6,167.28,233.37,201,211.24Z" />
            </g>
        </svg>
    );
    return (
        <div className='loadingButton'>
            <Icon
                spin
                style={{
                    color: "#ce4930", // cor do serviço
                    fontSize: "20pt" // aqui controlas o tamanho
                }}
                component={LoginSvgIcon}
            />

        </div>
    )
}
