import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

export default function Setting() {
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });
  const navigation=useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={styles.container}>
        <Header login={false} goBack={navigation.goBack} label={'Setting'} />
      

        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="globe"
                      size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Language</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>English</Text>

                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="moon"
                      size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Dark Mode</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                    onValueChange={darkMode => setForm({ ...form, darkMode })}
                    value={form.darkMode} />
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}
                  style={styles.row}>
                  <View
                    style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                    <FeatherIcon
                      color="#fff"
                      name="navigation"
                      size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Location</Text>

                  <View style={styles.rowSpacer} />

                  <Text style={styles.rowValue}>Binh Duong</Text>

                  <FeatherIcon
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>

              <View style={styles.sectionBody}>
                <View style={[styles.rowWrapper, styles.rowFirst]}>
                  <View style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                      <FeatherIcon
                        color="#fff"
                        name="at-sign"
                        size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Email Notifications</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                      onValueChange={emailNotifications =>
                        setForm({ ...form, emailNotifications })
                      }
                      value={form.emailNotifications} />
                  </View>
                </View>

                <View style={styles.rowWrapper}>
                  <View style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                      <FeatherIcon
                        color="#fff"
                        name="bell"
                        size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Push Notifications</Text>

                    <View style={styles.rowSpacer} />

                    <Switch
                      onValueChange={pushNotifications =>
                        setForm({ ...form, pushNotifications })
                      }
                      value={form.pushNotifications} />
                  </View>
                </View>

                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Pay')
                    }}
                    style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                      <FeatherIcon
                        color="#fff"
                        name="credit-card"
                        size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Pay</Text>

                    <View style={styles.rowSpacer} />

                    <Text style={styles.rowValue}>ZaloPay</Text>

                    <FeatherIcon
                      color="#C6C6C6"
                      name="chevron-right"
                      size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.rowWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DownloadedVideos')
                    }}
                    style={styles.row}>
                    <View
                      style={[styles.rowIcon, { backgroundColor: 'gray' }]}>
                      <FeatherIcon
                        color="#fff"
                        name="youtube"
                        size={20} />
                    </View>

                    <Text style={styles.rowLabel}>Dowloads</Text>

                    <View style={styles.rowSpacer} />
                    <Text style={styles.rowValue}>Play Video</Text>
                    <FeatherIcon
                      color="#C6C6C6"
                      name="chevron-right"
                      size={20} />
                  </TouchableOpacity>
                </View>
                
              </View>
            </View>
          </View>

         
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },

  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    color:'white',
    paddingLeft: 24,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  rowFirst: {
    borderTopWidth: 1,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: 'white',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B8B8B',
    marginRight: 4,
  },
});