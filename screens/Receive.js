import React, { useContext } from 'react';
import { Appbar } from 'react-native-paper';
import { AppContext } from '../components/ContextProvider';
import { Provider as PaperProvider } from 'react-native-paper';
import NavigationService from '../helpers/NavigationService';
import ConcealButton from '../components/ccxButton';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-root-toast';
import { colors } from '../constants/Colors';
import AppStyles from '../components/Style';
import {
  Text,
  View,
  Share,
  ScrollView,
  StyleSheet
} from "react-native";


const Receive = () => {
  const { state } = useContext(AppContext);
  const { appSettings, user, layout, wallets } = state;
  const currWallet = Object.keys(wallets).length > 0 && layout.walletsLoaded
    ? wallets[Object.keys(wallets).find(address => wallets[address].selected)]
    : null;

  onShare = async (content) => {
    try {
      const result = await Share.share({ message: "My CCX address is: " + content });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  onCopyAddress = async (text) => {
    let toast = Toast.show(text, {
      backgroundColor: colors.concealOrange,
      duration: Toast.durations.LONG,
      position: 50,
      animation: true,
      hideOnPress: true,
      shadow: true,
      delay: 300
    });
  }

  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  return (
    <PaperProvider>
      <Appbar.Header style={styles.appHeader}>
        <Appbar.BackAction onPress={() => NavigationService.goBack()} />
        <Appbar.Content
          title="Receive CCX"
        />
      </Appbar.Header>
      <View style={AppStyles.viewContainer}>
        <ScrollView style={AppStyles.viewContainer} contentContainerStyle={AppStyles.contentContainer}>
          <Text style={styles.address}>{currWallet.addr}</Text>
          <QRCode
            style={{ margin: 10 }}
            size={200}
            value={currWallet.addr}
            bgColor='black'
            fgColor='white'
          />
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnLeft]}
          onPress={() => this.onCopyAddress("Copied address to the clipboard...")}
          text="COPY"
        />
        <ConcealButton
          style={[styles.footerBtn, styles.footerBtnRight]}
          onPress={() => this.onShare(currWallet.addr)}
          text="SHARE"
        />
      </View>
    </PaperProvider>
  )
};

const styles = StyleSheet.create({
  appHeader: {
    borderBottomWidth: 1,
    backgroundColor: '#212529',
    borderBottomColor: '#343a40',
  },
  footer: {
    bottom: 10,
    left: 20,
    right: 20,
    position: 'absolute',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
  },
  footerBtnRight: {
    marginLeft: 5,
  },
  footerBtnLeft: {
    marginRight: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.concealOrange
  },
});

export default Receive;
