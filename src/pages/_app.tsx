import type { AppProps } from 'next/app';
import { Provider } from 'jotai';
import GlobalStyle from 'utils/GlobalStyle';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider>
			<GlobalStyle />
			<Component {...pageProps} />
		</Provider>
	);
}
