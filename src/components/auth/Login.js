import React, { useState } from 'react'
import { css } from '@emotion/core'

import firebase from 'firebase'
import Label from 'components/form/Label'
import Input from 'components/form/Input'
import Button from 'components/form/Button'
import useModal from '../modals/useModal'
import SignupModal from './SignupModal'

export default function Login ({ onDone, onCancel, isModal }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const showModal = useModal(SignupModal)
  
  function onGoToSignUp() {
    onCancel(formData)
    showModal(formData)
  }

  const onSubmit = async () => {
    const { email, password } = formData
    if (!email || !password) return alert('Email and Password are pretty much required!')
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async () => {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        if (onDone) onDone(formData)
      })
      .catch(function(error) {
        if (error.code) {
          setFormData({ ...formData, error: error.message })
          return
        }
      })
  }

  return (
    <div css={styles.box}>
      <h2 css={styles.title}>Login to Webframe! <span aria-label='love' role='img'>👋</span></h2>
      <p css={styles.sub}>Welcome back it's great to have you!</p>
      <Label htmlFor='emailInput'>E-mail</Label>
      <Input onChange={e => setFormData({ ...formData, email: e.target.value })} value={formData.email} id='emailInput' placeholder='awesome@person.com' type='email' />
      <Label htmlFor='passwordInput'>Password</Label>
      <Input onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} id='passwordInput' placeholder='super secret password' type='password' />
      <div css={styles.btnsWrapper}>
      <Button onClick={onSubmit} css={css`margin-top: 1em; margin-bottom: 1em; font-size: 1em;`}>Login</Button>
      {isModal && (
          <span 
            onClick={onGoToSignUp} 
            css={css`margin: 1em; font-size: 1em; cursor: pointer; color: #108db8;`}
          >
            Create an account.
          </span>)
        }
        </div>
      { formData.error && <p css={css`color: red;`}>Error: {formData.error}</p> }
    </div>
  )
}

const styles = {
  btnsWrapper: css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`,
  box: css`
    margin: auto;
    max-width: 500px;
    padding: 1em;
  `,
  title: css`
  `,
  sub: css`
  `,
}