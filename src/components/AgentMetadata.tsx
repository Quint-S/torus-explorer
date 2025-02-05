import { useState, useEffect } from 'react'
import { DetailRow, DetailLabel, DetailValue } from '../pages/AccountDetails'

interface AgentMetadataType {
  title?: string
  short_description?: string
  description?: string
  website?: string
  images?: {
    icon?: string
  }
  socials?: Record<string, string>
}

export const AgentMetadata = ({ metadataIpfs }: { metadataIpfs: string }) => {
  const [metadata, setMetadata] = useState<AgentMetadataType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const cid = metadataIpfs.replace('ipfs://', '')
        const response = await fetch(`https://${cid}.ipfs.dweb.link/`)
        const data = await response.json()
        setMetadata(data)
      } catch (err) {
        setError('Failed to fetch metadata')
      }
    }

    if (metadataIpfs.startsWith('ipfs://')) {
      fetchMetadata()
    }
  }, [metadataIpfs])

  if (error) return <div>Error loading metadata: {error}</div>
  if (!metadata) return null

  return (
    <div className="">
      <h3 className="text-lg font-semibold mb-1 ml-1 mt-1">Agent Metadata:</h3>
      {metadata.title && (
        <DetailRow>
          <DetailLabel>Title:</DetailLabel>
          <DetailValue>{metadata.title}</DetailValue>
        </DetailRow>
      )}
      {metadata.short_description && (
        <DetailRow>
          <DetailLabel>Short Description:</DetailLabel>
          <DetailValue>{metadata.short_description}</DetailValue>
        </DetailRow>
      )}
      {metadata.description && (
        <DetailRow>
          <DetailLabel>Description:</DetailLabel>
          <div className='text-white flex-1'>{metadata.description}</div>
        </DetailRow>
      )}
      {metadata.website && (
        <DetailRow>
          <DetailLabel>Website:</DetailLabel>
          <DetailValue>
            <a href={metadata.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {metadata.website}
            </a>
          </DetailValue>
        </DetailRow>
      )}
      {metadata.images?.icon && (
        <DetailRow>
          <DetailLabel>Icon:</DetailLabel>
          <DetailValue>
            <img 
              src={`https://${metadata.images.icon.replace('ipfs://', '')}.ipfs.dweb.link/`} 
              alt="Agent icon" 
              className="w-16 h-16"
            />
          </DetailValue>
        </DetailRow>
      )}
    </div>
  )
}