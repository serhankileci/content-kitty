import { Outlet } from "@tanstack/router";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";

import MobileSideBar from "../../components/MobileSideBar/MobileSideBar";
import { withInjection } from "../../ioc/withInjection";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { MetaDataPresenter } from "../../metadata/metadata.presenter";

import type { MetaDataViewModel } from "../../shared/types/viewmodels";
import { metaDataVmSignal } from "../../shared/signals/metaDataVmSignal";

type AppProps = {
	presenter?: InstanceType<typeof MetaDataPresenter>;
};

const AppComponent = observer((props: AppProps) => {
	const presenter = props.presenter;

	const [viewModel, setViewModel] = useState<MetaDataViewModel>({
		plugins: {
			enabledPlugins: [],
			disabledPlugins: [],
		},
		collections: [],
		hasCollections: false,
	});

	useEffect(() => {
		const load = () => {
			void presenter?.load().then(() => {
				setViewModel(presenter.viewModel);
				metaDataVmSignal.value = presenter.viewModel;
			});
		};
		load();
	}, []);

	return (
		<div className="pt-12">
			<DashboardLayout viewModel={viewModel}>
				<Outlet />
			</DashboardLayout>
			<MobileSideBar viewModel={viewModel} />
		</div>
	);
});

const App = withInjection({ presenter: MetaDataPresenter })(AppComponent);

export default App;
