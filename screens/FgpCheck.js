import { Icon } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConcealButton from '../components/ccxButton';
import localStorage from '../helpers/LocalStorage';
import { getAspectRatio } from '../helpers/utils';
import { AppColors } from '../constants/Colors';
import { View, Text } from 'react-native';
import { setItemAsync } from 'expo-secure-store';


const FgpCheck = props => {
  const { onComplete, onCancel } = props;

  // our hook into the state of the function component for the authentication mode
  const [isScanning, setIsScanning] = useState(0);
  const [fgpValue, setfgpValue] = useState(false);

  const startBiometricAuth = () => {
    if (isScanning == 0) {
      setIsScanning(1);

      LocalAuthentication.authenticateAsync().then(result => {
        setfgpValue(result.success);

        if (!result.success) {
          setIsScanning(0);
          startBiometricAuth();

          setTimeout(() => {
            setIsScanning(1);
          }, 3000);
        }

        // signal back success or failure
        onComplete({ success: result.success });
        // set to final state
        setIsScanning(2);
      });
    }
  }

  this.getFgpStatusText = () => {
    if (isScanning == 1) {
      return "Please use the fingerprint...";
    } else {
      if (fgpValue) {
        return "Fingerprint SUCCESS";
      } else {
        return "Fingerprint FAILED! Please try again";
      }
    }
  }

  this.getFgpStyle = () => {
    if (isScanning == 1) {
      return { color: AppColors.concealTextColor };
    } else {
      if (fgpValue) {
        return { color: AppColors.concealTextColor };
      } else {
        return { color: AppColors.concealErrorColor };
      }
    }
  }

  useEffect(() => {
    setIsScanning(0);
    startBiometricAuth();
  }, []);

  return (
    <View style={styles.fgpWrapper}>
      <Text style={styles.hello}>Hello,</Text>
      <Text style={styles.email}>{localStorage.get('id_username')}</Text>

      <View style={styles.fgpIconWrapper}>
        <Text style={[styles.fgpStatus, this.getFgpStyle()]}>{this.getFgpStatusText()}</Text>
        <Icon
          name='ios-finger-print'
          type='ionicon'
          color={fgpValue ? 'orange' : 'white'}
          size={128 * getAspectRatio()}
        />
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => {
            LocalAuthentication.cancelAuthenticate();
            setIsScanning(0);
            onCancel();
          }}
          text="CANCEL"
        />
      </View>
    </View>
  )
};

const styles = EStyleSheet.create({
  fgpWrapper: {
    flex: 1,
    paddingTop: '10rem'
  },
  fgpIconWrapper: {
    top: '40rem',
    left: '0rem',
    right: '0rem',
    bottom: '60rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fgpStatus: {
    fontSize: '18rem',
    marginBottom: '15rem'
  },
  hello: {
    fontSize: '22rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
  email: {
    fontSize: '16rem',
    textAlign: 'center',
    color: AppColors.concealTextColor,
  },
  footer: {
    bottom: '0rem',
    left: '20rem',
    right: '20rem',
    padding: '10rem',
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: AppColors.concealBackground
  },
  footerBtn: {
    flex: 1
  },
  footerBtnRight: {
    marginLeft: '5rem'
  },
  footerBtnLeft: {
    marginRight: '5rem'
  }
});

export default FgpCheck;