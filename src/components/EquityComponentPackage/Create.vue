<template>
    <div>
        <div class="col-md-12 col-lg-12" >
          <div v-if="statusCode" class="alert mt-3 alert-info alert-dismissible fade show mw-50 overflow-auto" role="alert">
            <button type="button" class="btn-close float-end" data-bs-dismiss="alert" aria-label="Close"></button>
            <h3>Démande : <span v-if="transaction.lg_operation ==='process'">autorisation et capture</span> <span v-else>crédit</span> envoyée</h3>
            Status code : {{ response.status }}
          </div>
        <h4 class="mb-3 text-primary">Test LincGate API</h4>
        <form 
        class="form"
        @submit.prevent="createTransaction" 
        style="height: 80vh;overflow: auto;"
        >
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="firstName" class="form-label">First name</label>
              <input v-model="transaction.financialActorExpedition.firstName" type="text" class="form-control" id="firstName" placeholder="" required>
              <div class="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Last name</label>
              <input v-model="transaction.financialActorExpedition.lastName" type="text" class="form-control" id="lastName" placeholder="" required>
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div class="col-12">
              <label for="email" class="form-label">Email <span class="text-muted">(Optional)</span></label>
              <input v-model="transaction.financialActorExpedition.email" type="email" class="form-control" id="email" placeholder="you@example.com">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>
            <div class="col-12">
              <label for="phone" class="form-label">Address</label>
              <input v-model="transaction.financialActorExpedition.address1" type="phone" class="form-control" id="address" placeholder="1234 Main St" required>
              <div class="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

            <div class="col-12">
              <label for="address" class="form-label">Phone</label>
              <input v-model="transaction.financialActorExpedition.phones[0].number" type="phone" class="form-control" id="address" placeholder="243xxxxxxxxx" required>
              <div class="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

            <div class="col-md-5">
              <label for="country" class="form-label">Country</label>
              <select v-model="transaction.financialActorExpedition.country" class="form-select" id="country" required>
                <option value="">Choose...</option>
                <option value="CD">Congo Kinshasa</option>
              </select>
              <div class="invalid-feedback">
                Please select a valid country.
              </div>
            </div>

            <div class="col-md-4">
              <label for="state" class="form-label">State</label>
              <select v-model="transaction.financialActorExpedition.city" class="form-select" id="state" required>
                <option value="">Choose...</option>
                <option value="CD-KN">Kinshasa</option>
              </select>
              <div class="invalid-feedback">
                Please provide a valid state.
              </div>
            </div>

            <div class="col-md-3">
              <label for="zip" class="form-label">Zip</label>
              <input type="text" class="form-control" id="zip" placeholder="" required>
              <div class="invalid-feedback">
                Zip code required.
              </div>
            </div>
          </div>

          <hr class="my-4">

          <!-- <div class="form-check">
            <input type="checkbox" class="form-check-input" id="same-address">
            <label class="form-check-label" for="same-address">L'adresse de livraison est la même que mon adresse de facturation</label>
          </div>

          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="save-info">
            <label class="form-check-label" for="save-info">Conservez ces informations pour la prochaine fois</label>
          </div> -->

          <h4 class="mb-3">Opération</h4>

          <div class="my-3">
            <div class="form-check">
              <input v-model="transaction.lg_operation" value="process" id="process" name="process" type="radio" class="form-check-input" checked>
              <label class="form-check-label" for="process">Autorisation et capture</label>
            </div>
            <div class="form-check">
              <input v-model="transaction.lg_operation" value="credit" id="credit" name="credit" type="radio" class="form-check-input">
              <label class="form-check-label" for="credit">Crédit</label>
            </div>
          </div>

          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" v-model="transaction.financialActorExpedition.cards[0].number" class="form-control" id="cc-number" placeholder="" required>
              <div class="invalid-feedback">
                Credit card number is required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration Month</label>
              <input type="number" class="form-control" id="cc-expiration" v-model="transaction.financialActorExpedition.cards[0].monthExpiration" placeholder="" required>
              <div class="invalid-feedback">
                Expiration date required
              </div>
            </div>
            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration year</label>
              <input type="number" class="form-control" id="cc-expiration" v-model="transaction.financialActorExpedition.cards[0].yearExpiration" placeholder="" required>
              <div class="invalid-feedback">
                Expiration date required
              </div>
            </div>
            <div class="col-md-6">
              <label for="cc-cvv" class="form-label">CVV (Require for Visa card and Mastercard)</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="" required>
              <div class="invalid-feedback">
                Security code required
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label for="cc-cvv" class="form-label">Montant (Ex. 100.00)</label>
            <input type="text" v-model="transaction.amount" class="form-control" id="cc-cvv" placeholder="" required>
            <div class="invalid-feedback">
              Amount code required
            </div>
          </div>

          <hr class="my-4">

          <button type="submit" class="w-100 btn btn-primary btn-lg">
            <div class="spinner-border" v-if="loading" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <span v-if="!loading">Confirmer</span></button>
        </form>
      </div>
    </div>
</template>

<script setup>
  import {useCreateTransaction} from '../../composition/transaction'
  const {
    loading,
    response,
    statusCode,
    transaction,
    createTransaction
  } = useCreateTransaction()
    
</script>

<style scoped>

</style>
