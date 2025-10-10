import AppNavButton from '../../Components/AppNavButton';
import { useTheme } from '../../Context/ThemeContext';
import Fonts from '../../../assets/fonts/Fonts';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UsernameInput from '../../Components/Inputs/CustomInput';
import EmailInput from '../../Components/Inputs/EmailInput';
import PhoneNumberInput from '../../Components/Inputs/NumberInput';

const ProfileScreen = ({navigation}) => {

   const { theme } = useTheme()

  const appVersion = '1.0';


    const headerConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.sm
  }

  const textConfig = {
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }

  const titleConfig = {
    color: theme.text,
    fontFamily: Fonts.family.semiBold,
    fontSize: Fonts.size.lg
  }

   const paratextConfig = {
        color: theme.secondaryText,
        fontFamily: Fonts.family.medium,
        fontSize: Fonts.size.xs
    }

  
  const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 80,
  }

  return (
    
    <View style={[styles.container,{backgroundColor:'#EDEFF2'}]}>

      {/* Profile Header */}
  
     <View style={[styles.header, { backgroundColor: theme.background }, shadow]}>
        <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                      <AppNavButton style={{backgroundColor:theme.text,alignSelf:"flex-start"}}/>
                </TouchableOpacity>

         <View style={styles.profileHeader}>
          <View>
            <Image
          source={require('../../../assets/images/person.png')} // Your rounded profile image
          style={styles.profileImage}
        />
        <Image source={require('../../../assets/images/edit.png')}  style={{width:30,height:30,position:"absolute",alignSelf:"flex-end",justifyContent:"flex-end",right:7}}/>
          </View>
        <Text style={[paratextConfig]}>Note:You can update your details anytime</Text>
      </View>

        </View>


      
      <View style={{alignItems:"center",flex:1}}>
  {/* Editable Fields */}
      <View style={styles.inputContainer}>
        <UsernameInput  type={"Username"} label={"Username"} placeholder={"Balamurugan"} icon={require('../../../assets/images/user.png')}/>
        <PhoneNumberInput />
        <EmailInput style={[styles.cardContainer,{backgroundColor:"white",borderWidth:0}]}  styleText={{color:theme.background}}/>
        <TouchableOpacity style={[styles.saveButton,{backgroundColor:theme.primary}]}>
          <Text style={styles.saveButtonText}>Save Details</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>PurePlus © 2025. All rights reserved.</Text>
        <Text style={styles.versionText}>Version {appVersion}</Text>
      </View>
      </View>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },


  cardContainer: {
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editText: {
    fontSize: 14,
    color: 'gray',
  },
  inputContainer: {
    width: '90%',
    paddingHorizontal: 10,
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
  versionText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topAppBar: {
    flexDirection: "row",
    justifyContent: 'space-between',
    paddingVertical: 10

  },
});

export default ProfileScreen;
