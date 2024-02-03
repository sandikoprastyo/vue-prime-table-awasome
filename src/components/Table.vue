<template>
  <div class="text-right">
    <div class="p-input-icon-left">
      <i class="pi pi-search"></i>
      <InputText
        v-model="filters['global'].value"
        size="large"
        placeholder="Global Search..."
      />
    </div>
  </div>
  <div class="action">
    <Button
      label="Clear All Filter"
      severity="danger"
      @click="handleClearAllFilter"
      :loading="loadingClear"
    />
    <Button
      label="Referesh"
      severity="help"
      @click="handleRefresh"
      :loading="loadingRef"
    />
    <Button
      label="Export"
      severity="info"
      @click="handleExport"
      :loading="loadingExp"
    />
    <Button
      label="Bayar"
      severity="success"
      @click="handleBayar($event)"
      :loading="loadingBayar"
    />
  </div>
  <div class="card">
    <DataTable
      dataKey="id"
      :value="customer"
      :filters="filters"
      v-model:filters="filters"
      tableStyle="min-width: 100rem"
      resizableColumns
      columnResizeMode="fit"
      paginator
      filterDisplay="row"
      :rows="5"
      v-model:selection="selectedCustomer"
      :rowsPerPageOptions="[5, 10, 20, 50, 70, 100]"
      showGridlines
      :loading="loadingRef"
      :globalFilterFields="[
        'no',
        'peserta',
        'va',
        'harga',
        'biayaAdmin',
        'ppn',
        'owner',
        'noPol',
        'total',
        'lelang',
        'jatuhTempo',
        'lunas',
        'status',
      ]"
    >
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column selectionMode="multiple" headerStyle="width: 1rem"> </Column>
      <Column :field="'number'" header="No" sortable> </Column>
      <Column field="no" header="No Kewajiban" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search No Kewajiban"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputText>
        </template>
      </Column>
      <Column field="noPol" header="No Polisi" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search No Polisi"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputText>
        </template>
      </Column>
      <Column field="owner" header="Pemilik" filterField="owner" sortable>
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span>{{ data.owner }}</span>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="representatives"
            placeholder="Select Pemilik"
            class="p-column-filter"
            style="min-width: 14rem"
            :maxSelectedLabels="1"
          >
            <template #option="slotProps">
              <div class="flex align-items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column field="peserta" header="Peserta" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search Peserta"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputText>
        </template>
      </Column>
      <Column field="va" header="Nomer VA" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search Nomer VA"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputText>
        </template>
      </Column>
      <Column field="harga" header="Harga Terbentuk (Rp)" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            inputId="currency-id"
            mode="currency"
            currency="IDR"
            locale="en-ID"
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search Harga Terbentuk"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputNumber>
          <Slider
            :min="0"
            :max="1000000000"
            v-model="filterModel.value"
            @change="filterCallback()"
            class="p-column-filter"
            style="min-width: 12rem"
          />
        </template>
      </Column>
      <Column field="biayaAdmin" header="Biaya Admin ex PPN (Rp)" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            inputId="percent"
            prefix="%"
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search Biaya Admin"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputNumber>
          <Slider
            min="0"
            max="100"
            v-model="filterModel.value"
            @change="filterCallback()"
            class="p-column-filter"
            style="min-width: 12rem"
            modelValue="10000"
          />
        </template>
      </Column>
      <Column field="ppn" header="PPN (Rp)" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            inputId="percent"
            prefix="%"
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search PPN"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputNumber>
          <Slider
            min="0"
            max="100"
            v-model="filterModel.value"
            @change="filterCallback()"
            class="p-column-filter"
            style="min-width: 12rem"
            modelValue="10000"
          />
        </template>
      </Column>
      <Column field="total" header="Total (Rp)" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <InputNumber
            inputId="currency-id"
            mode="currency"
            currency="IDR"
            locale="en-ID"
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Search Total"
            class="p-column-filter"
            style="min-width: 12rem"
            size="small"
          >
          </InputNumber>
          <Slider
            :min="0"
            :max="1000000000"
            v-model="filterModel.value"
            @change="filterCallback()"
            class="p-column-filter"
            style="min-width: 12rem"
            modelValue="10000"
          />
        </template>
      </Column>
      <Column field="lelang" header="Tanggal Lelang" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Calendar
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Select Date"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
            selectionMode="range"
            :manualInput="false"
            showIcon
            iconDisplay="input"
          >
          </Calendar>
        </template>
      </Column>
      <Column field="jatuhTempo" header="Tanggal Jatuh Tempo" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Calendar
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Select Date"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
            selectionMode="range"
            :manualInput="false"
            showIcon
            iconDisplay="input"
          >
          </Calendar>
        </template>
      </Column>
      <Column field="lunas" header="Tanggal Lunas" sortable>
        <template #filter="{ filterModel, filterCallback }">
          <Calendar
            v-model="filterModel.value"
            @change="filterCallback()"
            placeholder="Select Date"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
            selectionMode="range"
            :manualInput="false"
            showIcon
            iconDisplay="input"
          >
          </Calendar>
        </template>
      </Column>
      <Column
        field="status"
        header="Status"
        :showFilterMenu="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem"
      >
        <template #body="{ data }">
          <Tag :value="data.status" :severity="getSeverity(data.status)" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <Dropdown
            v-model="filterModel.value"
            @change="filterCallback()"
            :options="statuses"
            placeholder="Select One"
            class="p-column-filter"
            style="min-width: 12rem"
            :showClear="true"
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option"
                :severity="getSeverity(slotProps.option)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
    </DataTable>
  </div>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { CustomerService } from '../services/CustomerService';
import { FilterMatchMode } from 'primevue/api';
import { excelParser } from '../utils/excel-parser.js';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm();
const toast = useToast();

const loadingRef = ref(false);
const loadingExp = ref(false);
const loadingBayar = ref(false);
const loadingClear = ref(false);
const selectedCustomer = ref();

const customer = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  peserta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  va: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  harga: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  biayaAdmin: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  ppn: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  owner: { value: null, matchMode: FilterMatchMode.IN },
  noPol: { value: null, matchMode: FilterMatchMode.IN },
  total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  lelang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  jatuhTempo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  lunas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const statuses = ref(['LUNAS', 'PROSES PEMBAYARAN', 'KONFIRMASI PEMBAYARAN']);

const representatives = ref([
  'PT OLX',
  'PT MOBBI',
  'PT CARSOME',
  'PRIBADI',
  'PT XYZ',
]);

onMounted(() => {
  CustomerService.getCustomers().then((data) => {
    customer.value = data.map((item, index) => ({
      ...item,
      number: index + 1,
    }));
  });
});

const getSeverity = (status) => {
  switch (status) {
    case 'KONFIRMASI PEMBAYARAN':
      return 'danger';

    case 'LUNAS':
      return 'success';

    case 'PROSES PEMBAYARAN':
      return 'info';
  }
};

const handleClearAllFilter = () => {
  loadingClear.value = true;
  setTimeout(() => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      no: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      peserta: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      va: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      harga: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      biayaAdmin: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      ppn: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      owner: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      noPol: { value: null, matchMode: FilterMatchMode.IN },
      total: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      lelang: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      jatuhTempo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      lunas: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
    };
    loadingClear.value = false;
  }, 100);
};

const handleRefresh = () => {
  loadingRef.value = true;
  setTimeout(() => {
    loadingRef.value = false;
  }, 500);
};

const handleExport = () => {
  loadingExp.value = true;
  setTimeout(() => {
    excelParser('customer-data').exportDataFromJSON(customer.value, null, null);
    loadingExp.value = false;
  }, 500);
};

const handleBayar = (event) => {
  loadingBayar.value = true;
  const selectCustomer = selectedCustomer._rawValue;
  if (!selectCustomer || selectCustomer.length === 0) {
    toast.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Please select a customer!!',
      life: 3000,
    });
  } else {
    confirm.require({
      message: 'Are you sure you want to make a payment for this customer?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: 'No',
      acceptLabel: 'Yes',
      accept: () => {
        toast.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
          life: 3000,
        });
      },
      reject: () => {
        toast.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
    // prosess bayar
  }

  loadingBayar.value = false;
};

function formatRupiah(angka) {
  let reverse = angka.toString().split('').reverse().join('');
  let ribuan = reverse.match(/\d{1,3}/g);
  let formatted = ribuan.join('.').split('').reverse().join('');
  // return formatted;
  console.log(formatted);
}
</script>

<style scoped>
.action {
  gap: 5px;
  display: flex;
  align-items: center;
  justify-content: end;
}

.card {
  font-size: 10px;
}

.p-paginator,
.p-component {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
}

.p-tag,
.p-component,
.p-tag-success {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
</style>
