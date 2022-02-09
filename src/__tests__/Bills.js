/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import BillsUI from "../views/BillsUI.js"

import {getByRole, getByTestId} from '@testing-library/dom'
import { screen } from "@testing-library/dom"

// import VerticalLayout from './VerticalLayout.js'
import { bills } from "../fixtures/bills.js"

import userEvent from '@testing-library/user-event'

import Bills from "../containers/Bills.js"

import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
 
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({data: bills})
      document.body.innerHTML = html
      const eye = screen.getAllByTestId('icon-eye')
      //to-do write expect expression
      // let pathname = ROUTES_PATH['Bills']

      // document.body.innerHTML = html
    //  expect(screen.getByTestId('icon-window')).toHaveClass('active-icon')

    


    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

   
    
  })
  
})

//===============================

describe("Given I am connected as an employee", () => {
  describe("When I click on the eye icon", () => {
    test("A modal window should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({data:bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const myBills = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const eye = screen.getAllByTestId('icon-eye')
      const handleClickIconEye = jest.fn(myBills.handleClickIconEye(eye[0]))
      eye[0].addEventListener('click', handleClickIconEye)
      userEvent.click(eye[0])
      expect(handleClickIconEye).toHaveBeenCalled()
      const modale = screen.getByTestId('modaleFileEmploee')
      expect(modale).toBeVisible()
    })
  })

  describe("When I click on the button 'Nouvelle note de frais'", () => {
    test("A page 'Envoyer une note de frais' should open", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({data:bills})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const myBills = new Bills({
        document, onNavigate, store, bills, localStorage: window.localStorage
      })
      const button = screen.getByTestId('btn-new-bill')
      const handleClickNewBill = jest.fn(myBills.handleClickNewBill)
      button.addEventListener('click', handleClickNewBill)
      userEvent.click(button)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy()
      
    })
  })
})  
