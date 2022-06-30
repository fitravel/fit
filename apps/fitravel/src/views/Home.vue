<script setup lang="ts">
import { Page } from "../@"
import { Anchor } from "vui/@"
import { useAuth } from "heimdall"
import { onMounted } from "vue";
import { useRouter } from "vue-router"

const auth = useAuth()
const router = useRouter()

onMounted(() => { if (auth.isLoggedIn) router.push('/dash') })
</script>

<template>
	<Page>
		<section class="max-w-full mx-auto grid grid-cols-2 grid-rows-2 gap-8">

			<div class="col-span-1">
				<img src="/plane-goes-swoosh.jpg">
			</div>

			<div class="col-span-1">
				<img src="/plane-goes-swoosh.jpg">
			</div>

			<div class="col-span-2 grid items-center">
				<div class="mx-auto max-w-[50rem]">
					<h2>Markaðstorg</h2>
					<p>
						Á markaðstorgi Ferðaskrifstofu Íslands ehf. gefst ferðaskrifstofum með gilt 
						ferðaskrifstofuleyfi frá Ferðamálastofu („endurseljendum“) tækifæri til þess 
						að kaupa sæti í vélum FÍ í heildsölu. 
					</p>
					<p>
						Endurseljendur þurfa að óska eftir aðgangi að markaðstorginu með því að skrá 
						sig <Anchor to="/register">hér</Anchor>. Skráning er nauðsynleg til þess að fá 
						tilkynningu um fyrirhugaðar ferðir FÍ auk upplýsinga um áætlaðar dagsetningar 
						flugferða og áætlaðan sætisfjölda sem stendur endurseljendum til boða hverju sinni.
					</p>
					<p>
						Skilmála Markaðstorgs má <Anchor to="/terms">lesa hér</Anchor>.
					</p>
				</div>
			</div>

			<!-- <h2>Ferðaskrifstofa Íslands</h2>
			<p>
				Ferðaskrifstofa Íslands ehf. er ein stærsta ferðaskrifstofa landsins sem 
				samanstendur af Úrval Útsýn, Sumarferðum,  Plúsferðum og Iceland Travel Bureau 
				(Iceland Beyond).  Fyrirtækið hefur selt landsmönnum ferðir til útlanda allt 
				frá árinu 1955.  
			</p>
			<p>
				Ferðaskrifstofa Íslands ehf.  í núverandi mynd, má rekja til kaupa Úrval Útsýn 
				á Ferðaskrifstofu Íslands hf.  í október 1998.  Saga fyrirtækisins er þó talsvert 
				lengri, því hún nær allt aftur til ársins 1936, þegar Ferðaskrifstofa ríkisins var 
				stofnuð, en hún hafði einkarétt á starfrækslu slíkrar skrifstofu fyrir erlenda 
				ferðamenn.  Árið 1977 lagði nefnd um minnkun ríkisumsvifa fram þá tillögu að 
				ferðaskrifstofunni yrði komið úr umsjón ríkisins.  Það var þó ekki fyrr en árið 
				1985 að lög voru samþykkt á Alþingi, sem heimiluðu ríkisstjórninni að beita sér 
				fyrir stofnun hlutafélags, er taka skyldi við þáverandi rekstri Ferðaskrifstofu 
				ríkisins.  Hinn 1. október 1988 tók svo Ferðaskrifstofa Íslands hf. við rekstri 
				Ferðaskrifstofu ríkisins.
			</p> -->
		</section>
	</Page>
</template>