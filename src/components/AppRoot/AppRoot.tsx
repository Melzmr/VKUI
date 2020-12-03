import React, { createRef, PropsWithChildren, RefObject } from 'react';
import AdaptivityProvider, { AdaptivityProviderProps } from '../AdaptivityProvider/AdaptivityProvider';
import ConfigProvider, { ConfigProviderProps } from '../ConfigProvider/ConfigProvider';
import classNames from '../../lib/classNames';

export interface AppRootProps extends ConfigProviderProps, AdaptivityProviderProps {}

export class AppRoot extends React.Component<PropsWithChildren<AppRootProps>> {
  private readonly rootRef: RefObject<HTMLDivElement>;
  private readonly modalRoot: HTMLDivElement;

  constructor(props: AppRootProps) {
    super(props);
    this.modalRoot = props.window.document.createElement('div');
    this.modalRoot.setAttribute('id', 'vkui-modal-root');
    this.modalRoot.classList.add('vkui-modal-root');
    this.rootRef = createRef<HTMLDivElement>();
  }

  static defaultProps = {
    window: window,
  };

  update(props: AppRootProps) {
    if (!props.embedded) {
      props.window.document.documentElement.classList.add('vkui');
    } else {
      props.window.document.documentElement.classList.remove('vkui');
    }
  }

  componentDidMount() {
    this.props.window.document.body.appendChild(this.modalRoot);
    (this.rootRef.current.parentNode as HTMLElement).classList.add('vkui-root');
    this.update(this.props);
  }

  componentDidUpdate(prevProps: AppRootProps) {
    if (prevProps.embedded !== this.props.embedded) {
      this.update(this.props);
    }
  }

  componentWillUnmount() {
    this.props.window.document.body.removeChild(this.modalRoot);

    (this.rootRef.current.parentNode as HTMLElement).classList.remove('vkui-root');
    if (!this.props.embedded) {
      this.props.window.document.documentElement.classList.remove('vkui');
    }
  }

  render() {
    const {
      embedded,
      children,
      scheme,
      isWebView,
      webviewType,
      app,
      appearance,
      transitionMotionEnabled,
      platform,
      document,
      window,
      sizeX,
      sizeY,
      viewWidth,
      viewHeight,
      hasMouse,
    } = this.props;

    const configProviderProps: ConfigProviderProps = {
      scheme,
      isWebView,
      webviewType,
      app,
      appearance,
      transitionMotionEnabled,
      platform,
    };

    const adaptivityProviderProps: AdaptivityProviderProps = {
      embedded,
      document,
      window,
      sizeX,
      sizeY,
      viewWidth,
      viewHeight,
      hasMouse,
    };

    return (
      <div ref={this.rootRef} className={classNames('AppRoot', {
        'AppRoot--embedded': embedded,
      })}>
        <ConfigProvider {...configProviderProps}>
          <AdaptivityProvider {...adaptivityProviderProps} modalRoot={this.modalRoot}>
            {embedded ? (
              <div className="AppRoot__wrapper">
                {children}
              </div>
            ) : children}
          </AdaptivityProvider>
        </ConfigProvider>
      </div>
    );
  }
}

AppRoot.defaultProps = {
  ...ConfigProvider.defaultProps,
  ...AdaptivityProvider.defaultProps,
};

export default AppRoot;