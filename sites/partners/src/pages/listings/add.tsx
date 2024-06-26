import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { PageHeader, SiteAlert, t } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts"
import PaperListingForm from "../../components/listings/PaperListingForm"
import { MetaTags } from "../../components/shared/MetaTags"
import ListingGuard from "../../components/shared/ListingGuard"

const NewListing = () => {
  const router = useRouter()
  const metaDescription = ""
  const metaImage = "" // TODO: replace with hero image
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    if (!profile?.roles.isAdmin) {
      void router.push("/")
    }
  }, [profile, router])

  return (
    <ListingGuard>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>
        <MetaTags
          title={t("nav.siteTitlePartners")}
          image={metaImage}
          description={metaDescription}
        />

        <PageHeader className={"relative md:pt-16"} title={t("listings.newListing")}>
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="success" timeout={5000} dismissable />
          </div>
        </PageHeader>

        <PaperListingForm />
      </Layout>
    </ListingGuard>
  )
}

export default NewListing
