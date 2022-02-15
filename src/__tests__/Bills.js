/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import BillsUI from "../views/BillsUI.js"

import {getByRole, getByTestId} from '@testing-library/dom'

import Bills from "../containers/Bills.js"

import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import store from "../__mocks__/store"
import { bills } from "../fixtures/bills"


 
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
      // const antiChrono = (a, b) => ((a < b) ? 1 : -1)

      var months = [
        "Jan.", "Fév.","Mar.","Avr.","Mai.","Jui.","Jui.","Aoû.","Sep.","Oct.","Nov.", "Déc."
      ];

      function parse(date) {
        var parts = date.split(' ');
        return new Date('20'+parts[2], months.indexOf(parts[1]), parts[0]);
    }

    const antiChrono = function(a, b) {
      return parse(a).getTime() - parse(b).getTime();
    };

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

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to page 'Mes notes de frais'", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get")
       const bills = await store.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

